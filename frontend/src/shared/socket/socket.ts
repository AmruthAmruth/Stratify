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
    console.log("Connected User", userId);

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

// Group chat helpers
export const joinGroupRoom = (groupId: string) => {
  if (socket) {
    socket.emit("join-group", groupId);
    console.log(`Joined group room: ${groupId}`);
  }
};

export const leaveGroupRoom = (groupId: string) => {
  if (socket) {
    socket.emit("leave-group", groupId);
    console.log(`Left group room: ${groupId}`);
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