import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  socket = io("http://localhost:7000", {
    auth: { token },
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket?.id));
  socket.on("connect_error", (err: any) => console.error("⚠️ Socket error:", err?.message || err));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
