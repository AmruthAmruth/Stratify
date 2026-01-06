import { Manager } from "../../domain/entities/Manager";
import { ManagerDocument } from "../models/ManagerModel";
import { Types } from "mongoose";

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
      doc.profileImage,
      doc.address,
    );
  }

  static toDocument(entity: Manager): Partial<ManagerDocument> {
    return {
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      password: entity.password,
      role: entity.role,
      position: entity.position,
      joiningDate: entity.joiningDate,
      gender: entity.gender,
      dob: entity.dob,
      companyId: new Types.ObjectId(entity.companyId),
      departmentId: entity.departmentId ? new Types.ObjectId(entity.departmentId) : undefined,
      profileImage: entity.profileImage,
      address: entity.address,
    };
  }

  static toEntities(docs: ManagerDocument[]): Manager[] {
    return docs.map(this.toEntity);
  }
}
