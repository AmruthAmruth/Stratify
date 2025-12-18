import { Backlog } from "../../domain/entities/Backlog";
import { BacklogDocument } from "../models/BacklogModel";
import { Types } from "mongoose";

export class BacklogMapper {
  static toEntity(doc: BacklogDocument): Backlog {
    return new Backlog(
      doc.id.toString(),
      doc.projectId.toString(),
      doc.name,
      doc.description,
      doc.createdBy.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(entity: Backlog): Partial<BacklogDocument> {
    return {
      projectId: new Types.ObjectId(entity.projectId),
      name: entity.name,
      description: entity.description,
      createdBy: new Types.ObjectId(entity.createdBy),
    };
  }

  static toEntities(docs: BacklogDocument[]): Backlog[] {
    return docs.map(this.toEntity);
  }
}
