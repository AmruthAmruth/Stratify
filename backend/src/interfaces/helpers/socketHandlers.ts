import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { SocketGatewayDependencies } from "../../di/ChatDI";

interface AuthenticatedSocket extends Socket {
  userId: string;
}

interface SendMessageDTO {
  conversationId: string;
  content: string;
  type?: "text" | "image" | "file";
}

export class SocketGateway {
  constructor(
    private readonly io: Server,
    private readonly useCases: SocketGatewayDependencies["useCases"]
  ) {}

  init() {
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        (socket as AuthenticatedSocket).userId = decoded.id;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;
      console.log(`✅ User connected: ${authSocket.userId}`);

      socket.on("joinConversation", (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on("sendMessage", async (data: SendMessageDTO) => {
        try {
          const message = await this.useCases.sendMessageUseCase.execute({
            conversationId: data.conversationId,
            senderId: authSocket.userId,
            content: data.content,
            type: data.type || "text",
          });

          this.io.to(data.conversationId).emit("messageReceived", message);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err.message);
            socket.emit("error", err.message);
          } else {
            console.error(err);
            socket.emit("error", "Failed to send message");
          }
        }
      });

      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${authSocket.userId}`);
      });
    });
  }
}
