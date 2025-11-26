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
      created.isRead,
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
      (c) => new Chat(c.id, c.senderId, c.receiverId, c.message, c.isRead, c.createdAt)
    );
  }

  async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    await ChatModel.updateMany(
      { receiverId: userId, senderId: senderId, isRead: false },
      { $set: { isRead: true } }
    );
  }

  async getUnreadCounts(userId: string): Promise<Map<string, number>> {
    const unreadMessages = await ChatModel.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    const unreadMap = new Map<string, number>();
    unreadMessages.forEach((item) => {
      unreadMap.set(item._id, item.count);
    });
    return unreadMap;
  }

  async getLastMessageForUsers(userId: string, userIds: string[]): Promise<Map<string, Chat>> {
    if (userIds.length === 0) return new Map();

    const lastMessages = await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId, receiverId: { $in: userIds } },
            { senderId: { $in: userIds }, receiverId: userId },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    const resultMap = new Map<string, Chat>();
    lastMessages.forEach((item) => {
      const msg = item.lastMessage;
      resultMap.set(
        item._id,
        new Chat(
          msg._id.toString(),
          msg.senderId,
          msg.receiverId,
          msg.message,
          msg.isRead,
          msg.createdAt
        )
      );
    });

    return resultMap;
  }

  async deleteAllChatsForUser(userId: string): Promise<void> {
    await ChatModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  }
}