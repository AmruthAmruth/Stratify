import { Backlog } from "../../domain/entities/Backlog";
import { BacklogDocument } from "../models/BacklogModel"; 

export class BacklogMapper {
  static toEntity(doc: BacklogDocument): Backlog {
    return new Backlog(
      doc.id.toString(),
      doc.projectId.toString(),
      doc.name,
      doc.description,
      doc.createdBy.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toEntities(docs: BacklogDocument[]): Backlog[] {
    return docs.map(this.toEntity);
  }
}