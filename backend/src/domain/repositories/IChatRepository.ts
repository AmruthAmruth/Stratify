import { Chat } from "../entities/Chat";

export interface IChatRepository {
  save(chat: Chat): Promise<Chat>;
  getConversation(user1Id: string, user2Id: string): Promise<Chat[]>;
  markMessagesAsRead(userId: string, senderId: string): Promise<void>;
  getUnreadCounts(userId: string): Promise<Map<string, number>>;
  getLastMessageForUsers(userId: string, userIds: string[]): Promise<Map<string, Chat>>;
  deleteAllChatsForUser(userId: string): Promise<void>;
}
