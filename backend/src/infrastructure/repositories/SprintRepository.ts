import { Sprint } from "../../domain/entities/Sprint";
import { ISprintRepository } from "../../domain/repositories/ISprintRepository";
import { SprintMapper } from "../mappers/SprintMapper";
import { SprentModel } from "../models/SprintModel";


export class SprintRepository implements ISprintRepository {

  async create(sprint: Sprint): Promise<Sprint> {
    const doc = await SprentModel.create(SprintMapper.toDocument(sprint));
    return SprintMapper.toEntity(doc);
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const updatedDoc = await SprentModel.findByIdAndUpdate(
      sprint.id,
      SprintMapper.toDocument(sprint),
      { new: true }
    );

    if (!updatedDoc) throw new Error("Sprint not found");
    return SprintMapper.toEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await SprentModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Sprint | null> {
    const doc = await SprentModel.findById(id);
    return doc ? SprintMapper.toEntity(doc) : null;
  }

  async findByProject(projectId: string): Promise<Sprint[]> {
    const docs = await SprentModel.find({ projectId });
    return docs.map(SprintMapper.toEntity);
  }

  async findOverlappingSprint(projectId: string, startDate: Date, endDate: Date): Promise<Sprint | null> {
    const doc = await SprentModel.findOne({
      projectId,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } } // fully overlapping
      ]
    });

    return doc ? SprintMapper.toEntity(doc) : null;
  }


 async findByProjectId(projectId: string): Promise<Sprint[]> {
  const docs = await SprentModel.find({ projectId });
  return docs.map(SprintMapper.toEntity);
}



  async deleteByProjectId(projectId: string): Promise<void> {
    await SprentModel.deleteMany({ projectId });
  }
}