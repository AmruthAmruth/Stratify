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

      const messageData = {
        senderId,
        receiverId,
        message,
        createdAt: new Date().toISOString(),
      };

      const receiverSocketId = connectedUsers.get(receiverId);
      const senderSocketId = connectedUsers.get(senderId);

      // Send to receiver
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", messageData);
        console.log(`✅ Sent to receiver ${receiverId}`);
      }

      // Send back to sender for confirmation (so they see it in their chat)
      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", messageData);
        console.log(`✅ Sent back to sender ${senderId}`);
      }
    });


    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("stop-typing", { senderId });
    });


    // ---------- GROUP CHAT ----------
    socket.on("join-group", (groupId: string) => {
      socket.join(groupId);
      console.log(`👥 Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on("leave-group", (groupId: string) => {
      socket.leave(groupId);
      console.log(`👋 Socket ${socket.id} left group ${groupId}`);
    });

    socket.on("send-group-message", (data) => {
      const { groupId, senderId, message } = data;
      console.log(`💬 Group message from ${senderId} to group ${groupId}: ${message}`);

      // Broadcast to all members in the group room
      io.to(groupId).emit("receive-group-message", {
        groupId,
        senderId,
        message,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("group-typing", ({ senderId, groupId }) => {
      socket.to(groupId).emit("group-typing", { senderId, groupId });
    });

    socket.on("stop-group-typing", ({ senderId, groupId }) => {
      socket.to(groupId).emit("stop-group-typing", { senderId, groupId });
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
  messageData: {
    senderId: string;
    message: string;
    messageType?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  }
) => {
  const socketId = connectedUsers.get(receiverId);
  if (socketId) {
    io.to(socketId).emit("receive-message", messageData);
    console.log(`💌 Sent chat message to ${receiverId}`);
  }
};

// Group chat emitters
export const emitGroupMessage = (
  io: Server,
  groupId: string,
  messageData: {
    senderId: string;
    message: string;
    createdAt: string;
    senderName: string;
    messageType?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  }
) => {
  io.to(groupId).emit("receive-group-message", {
    groupId,
    ...messageData,
  });
  console.log(`💬 Sent group message to group ${groupId}`);
};

export const emitGroupTyping = (
  io: Server,
  groupId: string,
  senderId: string
) => {
  io.to(groupId).emit("group-typing", { senderId, groupId });
};

export const emitGroupMemberJoined = (
  io: Server,
  groupId: string,
  userId: string,
  userName: string
) => {
  io.to(groupId).emit("group-member-joined", {
    groupId,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  });
  console.log(`👤 User ${userName} joined group ${groupId}`);
};

export const emitGroupMemberLeft = (
  io: Server,
  groupId: string,
  userId: string,
  userName: string
) => {
  io.to(groupId).emit("group-member-left", {
    groupId,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  });
  console.log(`👋 User ${userName} left group ${groupId}`);
};
