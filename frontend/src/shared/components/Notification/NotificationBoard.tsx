import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setNotifications,
  addNotification,
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
import { connectSocket, getSocket } from "@/shared/socket/socket";

const NotificationBoard = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!socketRef.current) {
      socketRef.current = getSocket() || connectSocket(userId);
    }

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotification();
        if (data?.response?.length) {
          const sorted = data.response.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          dispatch(setNotifications(sorted));
        } else {
          dispatch(setNotifications([]));
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    const handleNewNotification = (notification: any) => {
      dispatch(addNotification(notification));
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
  }, [userId, dispatch]);

  const handleToggleRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    dispatch(updateNotification({ ...notification, isRead: !notification.isRead }));

    try {
      await toggleStatusUpdate(id);
    } catch (err) {
      dispatch(updateNotification(notification)); // revert on error
    }
  };

  const handleToggleReadAll = async () => {
    const prevNotifications = [...notifications];
    dispatch(setNotifications(notifications.map(n => ({ ...n, isRead: true }))));

    try {
      await readAllNotification();
    } catch (err) {
      dispatch(setNotifications(prevNotifications));
    }
  };

  const handleDelete = async (id: string) => {
    const prevNotifications = [...notifications];
    dispatch(removeNotification(id));

    try {
      await deleteNotification(id);
    } catch (err) {
      dispatch(setNotifications(prevNotifications));
    }
  };

  const handleDeleteAll = async () => {
    const prevNotifications = [...notifications];
    dispatch(clearNotifications());

    try {
      await deleteAllNotifications();
    } catch (err) {
      dispatch(setNotifications(prevNotifications));
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
