// src/shared/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:7000";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    console.log("Connedted User",userId);
    

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket?.emit("register", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
