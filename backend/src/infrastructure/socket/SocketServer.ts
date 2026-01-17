import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import logger from "../../shared/utils/logger";

const connectedUsers = new Map<string, string>();

interface JwtPayload {
  id: string;
  role: "company" | "manager" | "employee" | "super-admin";
}

interface AuthenticatedSocket {
  userId?: string;
  role?: string;
}

export const initSocket = (server: HttpServer) => {
  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173"];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        logger.warn("Socket connection attempt without token");
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      (socket as unknown as AuthenticatedSocket).userId = decoded.id;
      (socket as unknown as AuthenticatedSocket).role = decoded.role;

      logger.info(`Socket authenticated for user ${decoded.id}`);
      next();
    } catch (err) {
      logger.error("Socket authentication failed", { error: err });
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const authenticatedSocket = socket as unknown as AuthenticatedSocket;
    logger.info(`Socket connected: ${socket.id} (User: ${authenticatedSocket.userId})`);

    socket.on("register", (userId: string) => {
      // Validate that userId matches authenticated user
      if (userId !== authenticatedSocket.userId) {
        logger.warn(`User ${authenticatedSocket.userId} attempted to register as ${userId}`);
        return;
      }

      connectedUsers.set(userId, socket.id);
      logger.info(`User ${userId} registered for real-time updates`);
    });



    socket.on("send-message", (data) => {
      const { senderId, receiverId, message } = data;

      // Validate sender matches authenticated user
      if (senderId !== authenticatedSocket.userId) {
        logger.warn(`User ${authenticatedSocket.userId} attempted to send message as ${senderId}`);
        return;
      }

      // Basic message sanitization (prevent empty messages)
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        logger.warn(`Invalid message from ${senderId}`);
        return;
      }

      logger.debug(`Message from ${senderId} to ${receiverId}`);

      const messageData = {
        senderId,
        receiverId,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };

      const receiverSocketId = connectedUsers.get(receiverId);
      const senderSocketId = connectedUsers.get(senderId);


      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", messageData);
        logger.debug(`Message delivered to receiver ${receiverId}`);
      }


      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", messageData);
      }
    });


    socket.on("typing", ({ senderId, receiverId }) => {
      if (senderId !== authenticatedSocket.userId) {
        return;
      }

      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("typing", { senderId });
    });

    socket.on("stop-typing", ({ senderId, receiverId }) => {
      if (senderId !== authenticatedSocket.userId) {
        return;
      }

      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit("stop-typing", { senderId });
    });



    socket.on("join-group", (groupId: string) => {
      socket.join(groupId);
      logger.info(`User ${authenticatedSocket.userId} joined group ${groupId}`);
    });

    socket.on("leave-group", (groupId: string) => {
      socket.leave(groupId);
      logger.info(`User ${authenticatedSocket.userId} left group ${groupId}`);
    });

    socket.on("send-group-message", (data) => {
      const { groupId, senderId, message } = data;

      // Validate sender matches authenticated user
      if (senderId !== authenticatedSocket.userId) {
        logger.warn(`User ${authenticatedSocket.userId} attempted to send group message as ${senderId}`);
        return;
      }

      // Basic message sanitization
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        logger.warn(`Invalid group message from ${senderId}`);
        return;
      }

      logger.debug(`Group message from ${senderId} to group ${groupId}`);


      io.to(groupId).emit("receive-group-message", {
        groupId,
        senderId,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("group-typing", ({ senderId, groupId }) => {
      if (senderId !== authenticatedSocket.userId) {
        return;
      }

      socket.to(groupId).emit("group-typing", { senderId, groupId });
    });

    socket.on("stop-group-typing", ({ senderId, groupId }) => {
      if (senderId !== authenticatedSocket.userId) {
        return;
      }

      socket.to(groupId).emit("stop-group-typing", { senderId, groupId });
    });



    socket.on("disconnect", () => {
      for (const [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          logger.info(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};




export const emitNotification = (io: Server, userId: string, notification: unknown) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
    logger.debug(`Notification sent to user ${userId}`);
  }
};


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
    logger.debug(`Chat message sent to ${receiverId}`);
  }
};


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
  logger.debug(`Group message sent to group ${groupId}`);
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
  logger.info(`User ${userName} joined group ${groupId}`);
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
  logger.info(`User ${userName} left group ${groupId}`);
};
