import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { INotification } from "./types";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotification,
  readAllNotification,
  toggleStatusUpdate,
} from "@/services/notification";
import { connectSocket, getSocket } from "@/shared/socket/socket";

const NotificationBoard = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch notifications and setup socket
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize socket
    if (!socketRef.current) {
      socketRef.current = getSocket() || connectSocket(userId);
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotification();
        if (data?.response?.length) {
          const sorted = data.response.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
          setNotifications(sorted);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Handle real-time notifications
    const handleNewNotification = (notification: INotification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    if (socketRef.current) {
      socketRef.current.on("new-notification", handleNewNotification);
      socketRef.current.on("notification", handleNewNotification);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-notification", handleNewNotification);
        socketRef.current.off("notification", handleNewNotification);
      }
    };
  }, [userId]);

  // Toggle read/unread status
  const handleToggleRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: !n.isRead } : n
        )
      );
      await toggleStatusUpdate(id);
    } catch (err) {
      console.error("Failed to toggle read status:", err);
      // Revert if backend fails
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: !n.isRead } : n
        )
      );
    }
  };

  // Mark all notifications as read
  const handleToggleReadAll = async () => {
    const prevNotifications = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await readAllNotification();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications(prevNotifications);
    }
  };

  // Delete single notification
  const handleDelete = async (id: string) => {
    const prevNotifications = [...notifications];
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      setNotifications(prevNotifications);
    }
  };

  // Delete all notifications
  const handleDeleteAll = async () => {
    const prevNotifications = [...notifications];
    setNotifications([]);

    try {
      await deleteAllNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
      setNotifications(prevNotifications);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 text-[#3b3b3b] bg-[#fbfbfb] shadow-md rounded-md border border-[#dfdcef]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#3b3b3b]">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleToggleReadAll}
                className="text-sm text-[#009063] hover:text-[#007a4d] hover:underline transition-colors duration-200"
              >
                Mark All Read
              </button>
              <button
                onClick={handleDeleteAll}
                className="text-sm text-[#3b3b3b] hover:text-[#009063] hover:underline transition-colors duration-200"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-[#3b3b3b]/70">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-[#3b3b3b]/70">No notifications</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={() => handleToggleRead(n.id)}
              onDelete={() => handleDelete(n.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBoard;
