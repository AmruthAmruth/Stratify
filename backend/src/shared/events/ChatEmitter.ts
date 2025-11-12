import { emitChatMessage } from "../../infrastructure/socket/SocketServer";
import { io } from "../../main";

export class ChatEmitter {
  static emitMessage(receiverId: string, senderId: string, message: string) {
    emitChatMessage(io, receiverId, { senderId, message });
  }
}