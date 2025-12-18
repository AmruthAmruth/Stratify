import { Department } from "../../domain/entities/Department";
import { DepartmentDocument } from "../models/DepartmentModel";
import { Types } from "mongoose";

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

  static toDocument(entity: Department): Partial<DepartmentDocument> {
    return {
      name: entity.name,
      description: entity.description,
      companyId: new Types.ObjectId(entity.companyId),
      managerId: entity.managerId ? new Types.ObjectId(entity.managerId) : undefined,
    };
  }

  static toEntities(docs: DepartmentDocument[]): Department[] {
    return docs.map(this.toEntity);
  }
}
