
import { Issues } from "../../domain/entities/Issues";
import { IssueDocument } from "../models/IssueModel";


export class IssueMapper {
  static toEntity(doc: IssueDocument): Issues {
    return new Issues(
      doc.id.toString(),
      doc.heading,
      doc.description,
      doc.acceptanceCriteria,
      doc.size,
      doc.estimatedHours,
      doc.type,
      doc.status,
      doc.priority,
      doc.projectId.toString(),
      doc.sprintId?.toString() || null,
      doc.assignedTo?.toString() || null,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toEntities(docs: IssueDocument[]): Issues[] {
    return docs.map(this.toEntity);
  }
}