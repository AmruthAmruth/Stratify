import { IGroupMessageDTO } from "../../application/dto/chat/GroupMessageDTO";
import { GroupMessage } from "../../domain/entities/GroupMessage";
import { IGroupMessageRepository } from "../../domain/repositories/IGroupMessageRepository";
import GroupMessageModel from "../models/GroupMessageModel";

export class GroupMessageRepository implements IGroupMessageRepository {
  async saveMessage(
    groupId: string,
    senderId: string,
    message: string,
    messageType?: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string
  ): Promise<GroupMessage> {
    const doc = await GroupMessageModel.create({
      groupId,
      senderId,
      message,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      mimeType
    });
    return new GroupMessage(
      doc.id.toString(),
      doc.groupId,
      doc.senderId,
      doc.message,
      doc.createdAt,
      doc.messageType,
      doc.fileUrl,
      doc.fileName,
      doc.fileSize,
      doc.mimeType
    );
  }

  async getMessages(groupId: string, limit = 100, after?: Date): Promise<IGroupMessageDTO[]> {
    const query: { groupId: string; createdAt?: { $gt: Date } } = { groupId };
    if (after) query.createdAt = { $gt: after };

    // Get messages with sender names using aggregation
    const messages = await GroupMessageModel.aggregate([
      { $match: query },
      { $sort: { createdAt: 1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "employees", // MongoDB collection name for employees
          let: { senderIdStr: "$senderId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$senderIdStr"]
                }
              }
            },
            { $project: { name: 1 } }
          ],
          as: "senderInfo"
        }
      },
      {
        $addFields: {
          senderName: { $arrayElemAt: ["$senderInfo.name", 0] }
        }
      },
      {
        $project: {
          _id: 1,
          groupId: 1,
          senderId: 1,
          senderName: 1,
          message: 1,
          messageType: 1,
          fileUrl: 1,
          fileName: 1,
          fileSize: 1,
          mimeType: 1,
          createdAt: 1
        }
      }
    ]);

    return messages.map((m) => ({
      id: m._id.toString(),
      groupId: m.groupId,
      senderId: m.senderId,
      senderName: m.senderName || "Unknown User",
      message: m.message,
      messageType: m.messageType,
      fileUrl: m.fileUrl,
      fileName: m.fileName,
      fileSize: m.fileSize,
      mimeType: m.mimeType,
      createdAt: m.createdAt
    }));
  }
} 