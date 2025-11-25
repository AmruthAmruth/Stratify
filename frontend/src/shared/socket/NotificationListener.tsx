import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { getSocket, connectSocket } from "./socket";
import { addNotification } from "@/store/slices/notificationSlice";
import { RootState } from "@/store";

const NotificationListener = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    if (!userId) return;

    let socket = getSocket();
    if (!socket) {
      connectSocket(userId);
      socket = getSocket();
    }

    if (!socket) return;

    const handleNewNotification = (data: any) => {
      console.log("Received notification:", data);

      // Normalize the notification data structure
      const normalizedNotification = {
        id: data.id || data._id,
        title: data.title,
        message: data.message,
        isRead: data.isRead ?? false,
        createdAt: data.createdAt || new Date().toISOString(),
        ...data,
      };

      // Show toast
      enqueueSnackbar(data.message || "New notification", {
        variant: "info",
      });

      // Update Redux - this is the SINGLE source of truth
      dispatch(addNotification(normalizedNotification));
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket?.off("new-notification", handleNewNotification);
    };
  }, [enqueueSnackbar, dispatch, userId]);

  return null;
};

export default NotificationListener;
