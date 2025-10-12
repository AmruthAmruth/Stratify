import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(data: Omit<Message, "id">): Promise<Message>;
  findByConversation(conversationId: string): Promise<Message[]>;
  deleteMessage(messageId: string): Promise<void>;
}
