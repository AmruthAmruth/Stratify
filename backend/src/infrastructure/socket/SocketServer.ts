import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const connectedUsers = new Map<string, string>();

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId: string) => {
      connectedUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} connected`);
    });



    socket.on("send-message", (data) => {
      const { senderId, receiverId, message } = data;
      console.log(`💬 Message from ${senderId} to ${receiverId}: ${message}`);

      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", {
          senderId,
          message,
          createdAt: new Date().toISOString(),
        });
      }

      socket.emit("message-sent", {
        receiverId,
        message,
        createdAt: new Date().toISOString(),
      });
    });


    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("stop-typing", { senderId });
    });



    // ---------- NOTIFICATION ----------
    socket.on("disconnect", () => {
      for (const [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};


// ---------------- EMITTERS ----------------

// Notification emitter (you already had this)
export const emitNotification = (io: Server, userId: string, notification: unknown) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
    console.log(`🔔 Sent notification to user ${userId}`);
  }
};

// Chat emitter (new)
export const emitChatMessage = (
  io: Server,
  receiverId: string,
  messageData: { senderId: string; message: string }
) => {
  const socketId = connectedUsers.get(receiverId);
  if (socketId) {
    io.to(socketId).emit("receive-message", messageData);
    console.log(`💌 Sent chat message to ${receiverId}`);
  }
};
