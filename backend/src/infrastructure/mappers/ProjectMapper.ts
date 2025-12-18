import { Project } from "../../domain/entities/Project";
import { ProjectDocument } from "../models/ProjectModel";
import { Types } from "mongoose";

export class ProjectMapper {
  static toEntity(doc: ProjectDocument): Project {
    return new Project(
      doc.id.toString(),
      doc.name,
      doc.key,
      doc.description,
      doc.startDate,
      doc.endDate,
      doc.status,
      doc.departmentId.toString(),
      doc.projectLeadId.toString(),
      doc.createdBy.toString(),
      doc.createdByModel,
      doc.companyId.toString(),
      doc.teamMemberIds?.map((id) => id.toString()) || [],
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(entity: Project): Partial<ProjectDocument> {
    return {
      name: entity.name,
      key: entity.key,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      departmentId: new Types.ObjectId(entity.departmentId),
      projectLeadId: new Types.ObjectId(entity.projectLeadId),
      createdBy: new Types.ObjectId(entity.createdBy),
      createdByModel: entity.createdByModel,
      companyId: new Types.ObjectId(entity.companyId),
      teamMemberIds: entity.teamMemberIds?.map((id) => new Types.ObjectId(id)),
    };
  }

  static toEntities(docs: ProjectDocument[]): Project[] {
    return docs.map(this.toEntity);
  }
}
