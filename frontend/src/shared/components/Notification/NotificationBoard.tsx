import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { INotification } from "./types";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotification,
  toggleStatusUpdate,
} from "@/services/notification";
import { connectSocket, getSocket } from "@/shared/socket/socket";

const NotificationBoard = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize socket
    if (!socketRef.current) {
      socketRef.current = getSocket() || connectSocket(userId);
    }

    // Fetch initial notifications
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

    // Handle live incoming notifications
    const handleNewNotification = (notification: INotification) => {
      console.log("📩 New notification received:", notification);
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

  // ✅ Toggle read/unread status
  const handleToggleRead = async (id: string) => {
    try {
      await toggleStatusUpdate(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: !n.isRead } : n
        )
      );
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  // ✅ Delete one notification
  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // ✅ Delete all notifications
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 text-black bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">
          Notifications {notifications.length > 0 && `(${notifications.length})`}
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="text-sm text-red-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications</p>
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
