import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { INotification } from "./types";
import { getNotification } from "@/services/notification";
import { connectSocket } from "@/shared/socket/socket";

const NotificationBoard = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await getNotification();
        if (data?.response?.length) {
          // Add fetched notifications to state immediately
          setNotifications((prev) => {
            // Merge and remove duplicates just in case
            const merged = [...data.response, ...prev];
            const unique = merged.filter(
              (v, i, a) => a.findIndex((t) => t.id === v.id) === i
            );
            return unique;
          });
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // Connect socket for real-time notifications
    const socket = connectSocket(userId);
    const handleNewNotification = (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]); // prepend real-time notifications
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [userId]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold mb-4">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        notifications
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
            />
          ))
      )}
    </div>
  );
};

export default NotificationBoard;
