import { Sprint } from "../../domain/entities/Sprent";
import { ISprintRepository } from "../../domain/repositories/ISprentRepository";
import { SprintMapper } from "../mappers/SprentMapper";
import { SprintModel } from "../models/SprentModel";

export class SprentRepository implements ISprintRepository {

  async create(sprint: Sprint): Promise<Sprint> {
    const doc = await SprintModel.create(SprintMapper.toDocument(sprint));
    return SprintMapper.toEntity(doc);
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const updatedDoc = await SprintModel.findByIdAndUpdate(
      sprint.id,
      SprintMapper.toDocument(sprint),
      { new: true }
    );

    if (!updatedDoc) throw new Error("Sprint not found");
    return SprintMapper.toEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await SprintModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Sprint | null> {
    const doc = await SprintModel.findById(id);
    return doc ? SprintMapper.toEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({ projectId });
    return docs.map(SprintMapper.toEntity);
  }

  async findOverlappingSprint(projectId: string, startDate: Date, endDate: Date): Promise<Sprint | null> {
    const doc = await SprintModel.findOne({
      projectId,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } } // fully overlapping
      ]
    });

    return doc ? SprintMapper.toEntity(doc) : null;
  }
}