import { Types } from "mongoose";
import { Sprint } from "../../domain/entities/Sprint";
import { ISprintRepository } from "../../domain/repositories/ISprintRepository";
import { SprintModel } from "../models/SprintModel";
import { SprintMapper } from "../mappers/SprintMapper";

export class SprintRepository implements ISprintRepository {
  async create(sprint: Sprint): Promise<Sprint> {
    const doc = new SprintModel(SprintMapper.toDocument(sprint));
    const created = await doc.save();
    return SprintMapper.toEntity(created);
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const updated = await SprintModel.findByIdAndUpdate(
      new Types.ObjectId(sprint.id),
      SprintMapper.toDocument(sprint),
      { new: true }
    ).exec();

    if (!updated) throw new Error("Sprint not found");

    return SprintMapper.toEntity(updated);
  }

  async findById(id: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(new Types.ObjectId(id)).exec();
    return doc ? SprintMapper.toEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({
      projectId: new Types.ObjectId(projectId),
    }).exec();
    return docs.map(SprintMapper.toEntity);
  }

  async delete(id: string): Promise<void> {
    await SprintModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findOverlappingSprint(
    projectId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Sprint | null> {
    const overlapping = await SprintModel.findOne({
      projectId: new Types.ObjectId(projectId),
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    }).exec();

    return overlapping ? SprintMapper.toEntity(overlapping) : null;
  }
}
