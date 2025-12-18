import { Employee } from "../../domain/entities/Employee";
import { EmployeeDocument } from "../models/EmployeeModel";
import { Types } from "mongoose";

export class EmployeeMapper {
  static toEntity(doc: EmployeeDocument): Employee {
    return new Employee(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.password,
      doc.companyId.toString(),
      doc.departmentId?.toString(),
      doc.gender,
      doc.role,
      doc.managerId ? doc.managerId.toString() : undefined,
      doc.profileImage ?? undefined,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static toDocument(entity: Employee): Partial<EmployeeDocument> {
    return {
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      dob: entity.dob,
      joiningDate: entity.joiningDate,
      position: entity.position,
      password: entity.password,
      companyId: new Types.ObjectId(entity.companyId),
      departmentId: new Types.ObjectId(entity.departmentId),
      managerId: entity.managerId ? new Types.ObjectId(entity.managerId) : undefined,
      profileImage: entity.profileImage,
      gender: entity.gender,
      role: entity.role,
    };
  }

  static toEntities(docs: EmployeeDocument[]): Employee[] {
    return docs.map(this.toEntity);
  }
}
