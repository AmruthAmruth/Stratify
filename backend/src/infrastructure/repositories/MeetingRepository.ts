import { Meeting } from "../../domain/entities/Meeting";
import { IMeetingRepository } from "../../domain/repositories/IMeetingRepository";
import { MeetingDocument, MeetingModel } from "../models/MeetingModel";

export class MeetingRepository implements IMeetingRepository {
  async create(meeting: Omit<Meeting, "id" | "createdAt" | "updatedAt">): Promise<Meeting> {
    const doc = await MeetingModel.create(meeting);
    return this.toDomain(doc);
  }

  async findByRoomId(roomId: string): Promise<Meeting | null> {
    const doc = await MeetingModel.findOne({ roomId });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async close(roomId: string): Promise<void> {
    await MeetingModel.updateOne({ roomId }, { status: "closed" });
  }

  
  private toDomain(doc: MeetingDocument): Meeting {
    const obj = doc.toObject();
    return {
      id: obj._id.toString(),
      roomId: obj.roomId,
      creatorId: obj.creatorId.toString(),
      title: obj.title,
      status: obj.status,
      createdAt: obj.createdAt
    };
  }
}
