import { Department } from "../../domain/entities/Department";
import { IDepartmentRepository } from "../../domain/repositories/IDepartmentRepository";
import { DepartmentModel } from "../models/DepartmentModel";

export class DepartmentRepository implements IDepartmentRepository {
  async findByNameAndCompany(
    name: string,
    companyId: string
  ): Promise<Department | null> {
    const normalizedName = name.toLowerCase().trim();
    const doc = await DepartmentModel.findOne({ companyId, normalizedName }).exec();
    if (!doc) return null;

    return new Department(
      doc.id.toString(),
      doc.name,
      doc.description,
      doc.companyId.toString(),
      doc.managerId?.toString(),
      doc.createdAt,
      doc.updatedAt
    );
  }

  async create(department: Department): Promise<Department> {
   
    const created = await new DepartmentModel({
      name: department.name,
      description: department.description,
      companyId: department.companyId,
      managerId: department.managerId ?? null,
      
    }).save();

    return new Department(
      created.id.toString(),
      created.name,
      created.description,
      created.companyId.toString(),
      created.managerId?.toString(),
      created.createdAt,
      created.updatedAt
    );
  }
}
