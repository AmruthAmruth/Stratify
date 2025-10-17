import { Message } from "../../domain/entities/Message";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { MessageModel } from "../models/MessageModel";

export class MessageRepository implements IMessageRepository {
  async create(data: Omit<Message, "id">): Promise<Message> {
    const msgDoc = await MessageModel.create(data);

    return new Message(
      msgDoc.id.toString(),
      msgDoc.conversationId.toString(),
      msgDoc.senderId.toString(),
      msgDoc.content,
      msgDoc.type as "text" | "image" | "file",
      msgDoc.createdAt,
      msgDoc.updatedAt,
    );
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    const msgDocs = await MessageModel.find({ conversationId }).sort({
      createdAt: 1,
    });

    return msgDocs.map(
      (msg) =>
        new Message(
          msg.id.toString(),
          msg.conversationId.toString(),
          msg.senderId.toString(),
          msg.content,
          msg.type as "text" | "image" | "file",
          msg.createdAt,
          msg.updatedAt,
        ),
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    await MessageModel.findByIdAndDelete(messageId);
  }
}
