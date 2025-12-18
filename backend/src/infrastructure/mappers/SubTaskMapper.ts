import { SubTask } from "../../domain/entities/SubTask";
import { SubTaskDocument } from "../models/SubTaskModel";
import { Types } from "mongoose";

export class SubTaskMapper {
  static toEntity(doc: SubTaskDocument): SubTask {
    return new SubTask(
      doc.id.toString(),
      doc.issueId.toString(),
      doc.heading,
      doc.description,
      doc.hours,
      doc.status,
      doc.assignedToId ? doc.assignedToId.toString() : null,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(entity: SubTask): Partial<SubTaskDocument> {
    return {
      issueId: new Types.ObjectId(entity.issueId),
      heading: entity.heading,
      description: entity.description,
      hours: entity.hours,
      status: entity.status,
      assignedToId: entity.assignedToId ? new Types.ObjectId(entity.assignedToId) : undefined,
    };
  }

  static toEntities(docs: SubTaskDocument[]): SubTask[] {
    return docs.map(this.toEntity);
  }
}
