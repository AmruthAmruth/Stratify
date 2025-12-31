import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { getSocket, connectSocket } from "./socket";
import { addNotification, INotification } from "@/store/slices/notificationSlice";
import { RootState } from "@/store";

const NotificationListener = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!userId || !accessToken) return;

    let socket = getSocket();
    if (!socket) {
      connectSocket(userId, accessToken);
      socket = getSocket();
    }

    if (!socket) return;

    interface SocketNotificationData {
      id?: string;
      _id?: string;
      title: string;
      message: string;
      isRead?: boolean;
      createdAt?: string;
      type?: string;
      [key: string]: unknown;
    }

    const handleNewNotification = (data: unknown) => {
      const notificationData = data as SocketNotificationData;

      // Normalize the notification data structure
      const normalizedNotification = {
        ...notificationData,
        id: notificationData.id || notificationData._id || "",
        title: notificationData.title,
        message: notificationData.message,
        isRead: notificationData.isRead ?? false,
        createdAt: notificationData.createdAt || new Date().toISOString(),
      };

      // Show toast
      enqueueSnackbar(notificationData.message || "New notification", {
        variant: "info",
      });

      // Update Redux - this is the SINGLE source of truth
      dispatch(addNotification(normalizedNotification as unknown as INotification));
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket?.off("new-notification", handleNewNotification);
    };
  }, [enqueueSnackbar, dispatch, userId, accessToken]);

  return null;
};

export default NotificationListener;
