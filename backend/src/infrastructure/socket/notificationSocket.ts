import { Server } from "socket.io";
import { Server as HttpServer } from "http";



const connectedUsers = new Map<string, string>();


export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });


   io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId: string) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;


}


export const emitNotification = (io: Server, userId: string, notification: any) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
    console.log(`Sent notification to user ${userId}`);
  }
};