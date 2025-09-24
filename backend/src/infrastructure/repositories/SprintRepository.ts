import { Types } from "mongoose";
import { Sprint } from "../../domain/entities/Sprint";
import { ISprintRepository } from "../../domain/repositories/ISprintRepository";
import { SprintModel } from "../models/SprintModel";

export class SprintRepository implements ISprintRepository {
  async create(sprint: Sprint): Promise<Sprint> {
    const created = await new SprintModel({
      name: sprint.name,
      description:sprint.description,
      projectId: new Types.ObjectId(sprint.projectId),
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status ?? "Planned",
      teamCapacity: sprint.teamCapacity,
      totalStoryPoints: sprint.totalStoryPoints ?? 0,
      createdBy: new Types.ObjectId(sprint.createdBy),
    }).save();

    return new Sprint(
      created.id.toString(),
      created.name,
      created.description,
      created.projectId.toString(),
      created.startDate,
      created.endDate,
      created.status,
      created.teamCapacity,
      created.totalStoryPoints,
      created.createdBy.toString(),
      created.createdAt,
      created.updatedAt
    );
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const updated = await SprintModel.findByIdAndUpdate(
      new Types.ObjectId(sprint.id),
      {
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        teamCapacity: sprint.teamCapacity,
        totalStoryPoints: sprint.totalStoryPoints,
      },
      { new: true }
    ).exec();

    if (!updated) throw new Error("Sprint not found");

    return new Sprint(
      updated.id.toString(),
      updated.name,
      updated.description,
      updated.projectId.toString(),
      updated.startDate,
      updated.endDate,
      updated.status,
      updated.teamCapacity,
      updated.totalStoryPoints,
      updated.createdBy.toString(),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async findById(id: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(new Types.ObjectId(id)).exec();
    if (!doc) return null;

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
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findByProject(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();

    return docs.map(
      (doc) =>
        new Sprint(
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
          doc.createdAt,
          doc.updatedAt
        )
    );
  }

  async delete(id: string): Promise<void> {
    await SprintModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
