import { Issue } from "../../domain/entities/Issue";
import { IssueDocument } from "../models/IssueModel";
import { Types } from "mongoose";

export class IssueMapper {
  static toEntity(doc: IssueDocument): Issue {
    return new Issue(
      doc.id.toString(),
      doc.heading,
      doc.description,
      doc.acceptanceCriteria,
      doc.size,
      doc.type,
      doc.status,
      doc.priority,
      doc.projectId.toString(),
      doc.sprintId ? doc.sprintId.toString() : null,
      doc.assignedTo ? doc.assignedTo.toString() : null,
      doc.createdAt,
      doc.updatedAt,
      0, 
    );
  }

  static toDocument(entity: Issue): Partial<IssueDocument> {
    return {
      heading: entity.heading,
      description: entity.description,
      acceptanceCriteria: entity.acceptanceCriteria,
      size: entity.size,
      type: entity.type,
      status: entity.status,
      priority: entity.priority,
      projectId: new Types.ObjectId(entity.projectId),
      sprintId: entity.sprintId ? new Types.ObjectId(entity.sprintId) : undefined,
      assignedTo: entity.assignedTo ? new Types.ObjectId(entity.assignedTo) : undefined,
    };
  }

  static toEntities(docs: IssueDocument[]): Issue[] {
    return docs.map(this.toEntity);
  }
}
