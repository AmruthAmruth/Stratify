import { Types } from "mongoose";
import { Sprint } from "../../domain/entities/Sprint";
import { ISprintRepository } from "../../domain/repositories/ISprintRepository";
import { SprintModel } from "../models/SprintModel";

export class SprintRepository implements ISprintRepository {
  
  async create(sprint: Sprint): Promise<Sprint> {
    const created = await new SprintModel({
      name: sprint.name,
      description: sprint.description,
      projectId: new Types.ObjectId(sprint.projectId),
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status ?? "Planned",
      teamCapacity: sprint.teamCapacity,
      totalStoryPoints: sprint.totalStoryPoints ?? 0,
      createdBy: new Types.ObjectId(sprint.createdBy),
      userStoryIds: sprint.userStoryIds?.map(id => new Types.ObjectId(id)) || [],
    }).save();

    return this.mapToEntity(created);
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const updated = await SprintModel.findByIdAndUpdate(
      new Types.ObjectId(sprint.id),
      {
        name: sprint.name,
        description: sprint.description,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        teamCapacity: sprint.teamCapacity,
        totalStoryPoints: sprint.totalStoryPoints,
        userStoryIds: sprint.userStoryIds?.map(id => new Types.ObjectId(id)) || [],
      },
      { new: true }
    ).exec();

    if (!updated) throw new Error("Sprint not found");

    return this.mapToEntity(updated);
  }

  async findById(id: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(new Types.ObjectId(id)).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return docs.map(this.mapToEntity);
  }

  async delete(id: string): Promise<void> {
    await SprintModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findOverlappingSprint(projectId: string, startDate: Date, endDate: Date): Promise<Sprint | null> {
    const overlapping = await SprintModel.findOne({
      projectId: new Types.ObjectId(projectId),
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    }).exec();

    return overlapping ? this.mapToEntity(overlapping) : null;
  }

  // --------------------------
  // Helper: map Mongoose doc to domain entity
  // --------------------------
  private mapToEntity(doc: any): Sprint {
    return new Sprint(
      doc.id.toString(),
      doc.name,
      doc.description,
      doc.projectId.toString(),
      doc.startDate,
      doc.endDate,
      doc.status,
      doc.teamCapacity,
      doc.totalStoryPoints,
      doc.createdBy.toString(),
      doc.userStoryIds?.map((id: Types.ObjectId) => id.toString()) || [],
      doc.createdAt,
      doc.updatedAt
    );
  }
}
