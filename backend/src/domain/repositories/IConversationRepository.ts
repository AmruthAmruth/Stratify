import { Conversation } from "../entities/Conversation";


export interface IConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  create(data: Omit<Conversation, "id">): Promise<Conversation>;
  updateLastMessage(id: string, message: string): Promise<void>;
  findUserConversations(userId: string): Promise<Conversation[]>;
}