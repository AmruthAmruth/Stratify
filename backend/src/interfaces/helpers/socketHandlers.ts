import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { SocketGatewayDependencies } from "../../di/ChatDI";

interface AuthenticatedSocket extends Socket {
  userId: string;
}

interface SendMessageDTO {
  conversationId?: string;
  content: string;
  type?: "text" | "image" | "file";
  receiverId?: string;
}

export class SocketGateway {
  constructor(
    private readonly io: Server,
    private readonly useCases: SocketGatewayDependencies["useCases"],
  ) {}

  init() {
    
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
          id: string;
        };
        (socket as AuthenticatedSocket).userId = decoded.id;
        next();
      } catch (err) {
        console.error("Socket authentication failed:", err);
        next(new Error("Invalid or expired token"));
      }
    });

    
    this.io.on("connection", async (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;
      console.log(`User connected [ID: ${authSocket.userId}]`);

      
      try {
        const conversations =
          await this.useCases.getUserConversationsUseCase.execute(
            authSocket.userId,
          );
        conversations.forEach((conv) => {
          if (conv.id) socket.join(conv.id);
          else console.warn("Skipped conversation without ID:", conv);
        });
      } catch (err) {
        console.error("Failed to auto-join conversations:", err);
      }

      
      socket.on("joinConversation", (conversationId: string) => {
        if (!conversationId) {
          socket.emit("joinConversationError", {
            message: "conversationId is required",
          });
          return;
        }

        socket.join(conversationId);
        socket.emit("joinedConversation", conversationId);
      });

      
      socket.on("sendMessage", async (data: SendMessageDTO) => {
        try {
          const senderId = authSocket.userId;
          if (!data.content) throw new Error("Message content is required");
          if (!data.conversationId && !data.receiverId)
            throw new Error("Either conversationId or receiverId is required");

          let conversationId = data.conversationId;

          
          if (!conversationId && data.receiverId) {
            const conversation =
              await this.useCases.createConversationUseCase.execute({
                isGroup: false,
                members: [senderId, data.receiverId],
                lastMessage: "",
              });

            conversationId = conversation.id;
          }

          if (!conversationId)
            throw new Error("Failed to determine conversation ID");

          
          const message = await this.useCases.sendMessageUseCase.execute(
            {
              conversationId,
              senderId,
              content: data.content,
              type: data.type || "text",
            },
            data.receiverId,
          );

          
          socket.join(conversationId);
          this.io.to(conversationId).emit("messageReceived", message);

          
          if (data.receiverId) {
            const receiverSocket = Array.from(
              this.io.sockets.sockets.values(),
            ).find(
              (s) => (s as AuthenticatedSocket).userId === data.receiverId,
            ) as AuthenticatedSocket | undefined;

            if (receiverSocket && !receiverSocket.rooms.has(conversationId)) {
              receiverSocket.join(conversationId);
            }

            receiverSocket?.emit("messageReceived", message);
          }

          console.log(
            ` Message sent from ${senderId} in conversation ${conversationId}`,
          );
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Failed to send message";
          console.error(" sendMessage error:", msg);
          socket.emit("sendMessageError", { message: msg });
        }
      });

      
      socket.on("disconnect", () => {
        console.log(` User disconnected [ID: ${authSocket.userId}]`);
      });
    });

    
    this.io.on("connect_error", (err) => {
      console.error(" Socket connection error:", err.message);
    });
  }
}
