import { Project } from "../../domain/entities/Project";
import { ProjectDocument } from "../models/ProjectModel";

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

  static toEntities(docs: ProjectDocument[]): Project[] {
    return docs.map(this.toEntity);
  }
}
