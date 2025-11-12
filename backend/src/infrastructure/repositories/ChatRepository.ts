import { Chat } from "../../domain/entities/Chat";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import ChatModel from "../models/ChatModel";


export class ChatRepository implements IChatRepository {
  async save(chat: Chat): Promise<Chat> {
    const created = await ChatModel.create(chat);
    return new Chat(
      created.id,
      created.senderId,
      created.receiverId,
      created.message,
      created.createdAt
    );
  }

 async getConversation(user1Id: string, user2Id: string): Promise<Chat[]> {
  const chats = await ChatModel.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
  }).sort({ createdAt: 1 });

  return chats.map(
    (c) => new Chat(c.id, c.senderId, c.receiverId, c.message, c.createdAt)
  );
}

  async deleteAllChatsForUser(userId: string): Promise<void> {
    await ChatModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  }
}