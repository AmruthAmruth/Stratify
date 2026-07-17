// src/shared/socket.ts
import { io, Socket } from "socket.io-client";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const SOCKET_URL = isLocal
  ? "http://localhost:7000"
  : import.meta.env.VITE_SOCKET_URL || "https://stratify-sboa.onrender.com";

let socket: Socket | null = null;

export const connectSocket = (userId: string, token: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: token, // Pass JWT token for authentication
      },
    });

    socket.on("connect", () => {
      socket?.emit("register", userId);
    });

    socket.on("disconnect", () => {
      // Socket disconnected
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
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

// Group chat helpers
export const joinGroupRoom = (groupId: string) => {
  if (socket) {
    socket.emit("join-group", groupId);
  }
};

export const leaveGroupRoom = (groupId: string) => {
  if (socket) {
    socket.emit("leave-group", groupId);
  }
};

export const sendGroupTyping = (groupId: string, senderId: string) => {
  if (socket) {
    socket.emit("group-typing", { groupId, senderId });
  }
};

export const sendStopGroupTyping = (groupId: string, senderId: string) => {
  if (socket) {
    socket.emit("stop-group-typing", { groupId, senderId });
  }
};