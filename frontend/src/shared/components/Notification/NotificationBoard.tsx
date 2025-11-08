import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { INotification } from "./types";
import { getNotification } from "@/services/notification";
import { connectSocket, getSocket } from "@/shared/socket/socket";

const NotificationBoard = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize socket once
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

    // Handle live notifications - appears as instantly as React state updates allow
    const handleNewNotification = (notification: INotification) => {
      console.log("📩 Real-time notification received:", notification);

      // Directly update state (React will batch and re-render asynchronously, but this is the standard way)
      // If you're on React 18+, consider adding flushSync for synchronous rendering (import { ..., flushSync } from "react"; and wrap the setNotifications call)
      // For older React versions, this inherent async update may introduce a tiny delay (~16ms per frame)
      setNotifications((prev) => {
        // Check if notification already exists
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          console.log("⚠️ Duplicate notification ignored:", notification.id);
          return prev;
        }

        // Add new notification at the top
        console.log("✅ Adding new notification to UI");
        return [notification, ...prev];
      });
    };

    // Listen for both possible event names from backend
    if (socketRef.current) {
      socketRef.current.on("new-notification", handleNewNotification);
      socketRef.current.on("notification", handleNewNotification);
      
      console.log("🔌 Socket listeners registered");
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-notification", handleNewNotification);
        socketRef.current.off("notification", handleNewNotification);
        console.log("🔌 Socket listeners cleaned up");
      }
    };
  }, [userId]);

  const handleMarkRead = (id: string) => {
    // Update the notification as read without removing it
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 text-black bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold mb-4">
        Notifications {notifications.length > 0 && `(${notifications.length})`}
      </h3>
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
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBoard;