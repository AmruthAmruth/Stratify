import { Department } from "../../domain/entities/Department";
import { DepartmentDocument } from "../models/DepartmentModel";

export class DepartmentMapper {
  static toEntity(doc: DepartmentDocument): Department {
    return new Department(
      doc.id.toString(),
      doc.name,
      doc.description,
      doc.companyId.toString(),
      doc.managerId?.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toEntities(docs: DepartmentDocument[]): Department[] {
    return docs.map(this.toEntity);
  }
}
