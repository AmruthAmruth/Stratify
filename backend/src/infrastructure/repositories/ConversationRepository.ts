import { Conversation } from "../../domain/entities/Conversation";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ConversationModel } from "../models/ConversationModel";
import { Types } from "mongoose";

export class ConversationRepository implements IConversationRepository {

  
  async create(data: Omit<Conversation, "id">): Promise<Conversation> {
    const convoDoc = await ConversationModel.create(data);

    return new Conversation(
      convoDoc.id.toString(),
      convoDoc.isGroup,
      convoDoc.name,
      convoDoc.members.map((m) => m.toString()),
      convoDoc.lastMessage,
      convoDoc.createdAt,
      convoDoc.updatedAt,
    );
  }
  
  async findById(id: string): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const convoDoc = await ConversationModel.findById(id);
    if (!convoDoc) return null;

    return new Conversation(
      convoDoc.id.toString(),
      convoDoc.isGroup,
      convoDoc.name,
      convoDoc.members.map((m) => m.toString()),
      convoDoc.lastMessage,
      convoDoc.createdAt,
      convoDoc.updatedAt,
    );
  }

  
  async findUserConversations(userId: string): Promise<Conversation[]> {
    if (!Types.ObjectId.isValid(userId)) return [];

    const userObjectId = new Types.ObjectId(userId);
    const convoDocs = await ConversationModel.find({
      members: userObjectId,
    }).sort({ updatedAt: -1 });

    return convoDocs.map(
      (convo) =>
        new Conversation(
          convo.id.toString(),
          convo.isGroup,
          convo.name,
          convo.members.map((m) => m.toString()),
          convo.lastMessage,
          convo.createdAt,
          convo.updatedAt,
        ),
    );
  }

  
  async updateLastMessage(id: string, message: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;

    await ConversationModel.findByIdAndUpdate(
      id,
      { lastMessage: message, updatedAt: new Date() },
      { new: true },
    );
  }

  
  async findByMembers(members: string[]): Promise<Conversation | null> {
    const objectIds: Types.ObjectId[] = [];

    for (const m of members) {
      if (!Types.ObjectId.isValid(m)) return null;
      objectIds.push(new Types.ObjectId(m));
    }

    const convoDoc = await ConversationModel.findOne({
      members: { $all: objectIds, $size: members.length },
    });

    if (!convoDoc) return null;

    return new Conversation(
      convoDoc.id.toString(),
      convoDoc.isGroup,
      convoDoc.name,
      convoDoc.members.map((m) => m.toString()),
      convoDoc.lastMessage,
      convoDoc.createdAt,
      convoDoc.updatedAt,
    );
  }
}
