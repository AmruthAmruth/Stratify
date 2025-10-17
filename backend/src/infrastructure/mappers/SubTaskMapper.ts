import { SubTask } from "../../domain/entities/SubTask";
import { SubTaskDocument } from "../models/SubTaskModel";

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

  static toEntities(docs: SubTaskDocument[]): SubTask[] {
    return docs.map(this.toEntity);
  }
}
