
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


  async findMeetingByCreatorId(creatorId: string): Promise<Meeting[]> {
    const docs = await MeetingModel.find({ creatorId: creatorId, status: "open" });
    return docs.map(doc => this.toDomain(doc));
  }

  async findByTitle(title: string): Promise<boolean> {
    const doc = await MeetingModel.findOne({ title: { $regex: `^${title}$`, $options: "i" } });
    return !!doc
  }

  async findByProjectId(projectId: string): Promise<Meeting[]> {
    const docs = await MeetingModel.find({ projectId });
    return docs.map(doc => this.toDomain(doc));
  }

  async findByProjectAndDate(projectId: string, date: Date): Promise<Meeting | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const doc = await MeetingModel.findOne({
      projectId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!doc) return null;
    return this.toDomain(doc);
  }


  private toDomain(doc: MeetingDocument): Meeting {
    const obj = doc.toObject();
    return new Meeting(
      obj._id.toString(),
      obj.roomId,
      obj.creatorId.toString(),
      obj.title,
      obj.status,
      obj.projectId?.toString(),
      obj.isRecurring || false,
      obj.scheduledDate,
      obj.createdAt
    );
  }
}
