import { Chat } from "../entities/Chat";

export interface IChatRepository {
  save(chat: Chat): Promise<Chat>;
  getConversation(user1Id: string, user2Id: string): Promise<Chat[]>;
  deleteAllChatsForUser(userId: string): Promise<void>;
}
