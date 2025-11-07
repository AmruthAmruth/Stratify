// src/shared/NotificationListener.tsx
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { getSocket } from "./socket";

const NotificationListener = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("new-notification", (message: string) => {
      console.log("Received notification:", message);
      enqueueSnackbar(message, { variant: "info" });
    });

    return () => {
      socket?.off("new-notification");
    };
  }, [enqueueSnackbar]);

  return null;
};

export default NotificationListener;
