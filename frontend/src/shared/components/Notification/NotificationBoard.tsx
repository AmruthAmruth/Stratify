import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setNotifications,
  updateNotification,
  removeNotification,
  clearNotifications,
} from "@/store/slices/notificationSlice";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotification,
  readAllNotification,
  toggleStatusUpdate,
} from "@/services/notification";
import { LoadingSpinner } from "@/shared/components/Loading";

const NotificationBoard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data: any = await getNotification();
        if (data?.response?.length) {
          const apiNotifications = data.response.map((n: any) => ({
            ...n,
            id: n.id || n._id, // Normalize ID field
          }));

          // Merge API data with existing socket notifications
          const existingIds = new Set(notifications.map(n => n.id));
          const newFromApi = apiNotifications.filter(
            (n: any) => !existingIds.has(n.id)
          );

          // Combine and sort all notifications
          const merged = [...notifications, ...newFromApi].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Remove duplicates (keep first occurrence)
          const uniqueMap = new Map();
          merged.forEach(n => {
            if (!uniqueMap.has(n.id)) {
              uniqueMap.set(n.id, n);
            }
          });

          dispatch(setNotifications(Array.from(uniqueMap.values())));
        } else if (notifications.length === 0) {
          dispatch(setNotifications([]));
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we don't have notifications yet (first load)
    // App.tsx already loads notifications on login
    if (notifications.length === 0) {
      fetchNotifications();
    } else {
      setIsLoading(false);
    }
  }, []); // Empty deps - only run once on mount

  const handleToggleRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    dispatch(updateNotification({ ...notification, isRead: !notification.isRead }));

    try {
      await toggleStatusUpdate(id);
    } catch {
      dispatch(updateNotification(notification));
    }
  };

  const handleToggleReadAll = async () => {
    const prevNotifications = [...notifications];
    dispatch(setNotifications(notifications.map(n => ({ ...n, isRead: true }))));

    try {
      await readAllNotification();
    } catch {
      dispatch(setNotifications(prevNotifications));
    }
  };

  const handleDelete = async (id: string) => {
    const prevNotifications = [...notifications];
    dispatch(removeNotification(id));

    try {
      await deleteNotification(id);
    } catch {
      dispatch(setNotifications(prevNotifications));
    }
  };

  const handleDeleteAll = async () => {
    const prevNotifications = [...notifications];
    dispatch(clearNotifications());

    try {
      await deleteAllNotifications();
    } catch {
      dispatch(setNotifications(prevNotifications));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 text-[#3b3b3b] bg-[#fbfbfb] shadow-md rounded-md border border-[#dfdcef]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#3b3b3b]">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        {notifications.length > 0 && (
          <div className="flex gap-2">
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
          </div>
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner variant="dots" size="small" />
          </div>
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