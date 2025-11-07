import { useEffect, useState } from "react";
import socket from "./sokect";


export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<unknown[]>([]);

  useEffect(() => {
    
    socket.emit("register", userId);

    
    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, [userId]);

  return { notifications, setNotifications };
};