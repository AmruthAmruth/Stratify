import { Employee } from "../../domain/entities/Employee";
import { EmployeeDocument } from "../models/EmployeeModel"; 
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
      doc.updatedAt
    );
  }

  static toEntities(docs: EmployeeDocument[]): Employee[] {
    return docs.map(this.toEntity);
  }
}
