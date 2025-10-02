import { Manager } from "../../domain/entities/Manager";
import { ManagerDocument } from "../models/ManagerModel"; 

export class ManagerMapper {
  static toEntity(doc: ManagerDocument): Manager {
    return new Manager(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.password,
      doc.role,
      doc.position,
      doc.joiningDate,
      doc.gender,
      doc.dob,
      doc.companyId.toString(),
      doc.departmentId?.toString(),
      doc.profileImage
    );
  }

  static toEntities(docs: ManagerDocument[]): Manager[] {
    return docs.map(this.toEntity);
  }
}
