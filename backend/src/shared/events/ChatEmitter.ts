import { emitChatMessage } from "../../infrastructure/socket/SocketServer";
import { io } from "../../main";

export class ChatEmitter {
  static emitMessage(
    receiverId: string,
    senderId: string,
    message: string,
    messageType?: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string
  ) {
    emitChatMessage(io, receiverId, {
      senderId,
      message,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      mimeType
    });
  }
}