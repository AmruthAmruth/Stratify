import { Types } from "mongoose";
import { Department } from "../../domain/entities/Department";
import { IDepartmentRepository } from "../../domain/repositories/IDepartmentRepository";
import { DepartmentModel } from "../models/DepartmentModel";
import { DepartmentMapper } from "../mappers/DepartmentMapper";

export class DepartmentRepository implements IDepartmentRepository {
  async findByNameAndCompany(
    name: string,
    companyId: string
  ): Promise<Department | null> {
    const normalizedName = name.toLowerCase().trim();
    const doc = await DepartmentModel.findOne({
      companyId,
      normalizedName,
    }).exec();
    if (!doc) return null;

    return DepartmentMapper.toEntity(doc);
  }

  async create(department: Department): Promise<Department> {
    const created = await new DepartmentModel({
      name: department.name,
      description: department.description,
      companyId: department.companyId,
      managerId: department.managerId ?? null,
    }).save();

    return DepartmentMapper.toEntity(created);
  }

  async findById(id: string): Promise<Department | null> {
    const doc = await DepartmentModel.findById(id).exec();
    if (!doc) return null;

    return DepartmentMapper.toEntity(doc);
  }

  async assignManager(departmentId: string, managerId: string): Promise<void> {
    await DepartmentModel.findByIdAndUpdate(
      new Types.ObjectId(departmentId),
      { managerId: new Types.ObjectId(managerId) },
      { new: true }
    ).exec();
  }

  async findDepartmentsByCompanyId(companyId: string): Promise<Department[]> {
    const docs = await DepartmentModel.find({ companyId }).exec();
    return DepartmentMapper.toEntities(docs);
  }

  async getUnassignedDepartments(
    companyId: string
  ): Promise<{ id: string; name: string }[]> {
    const docs = await DepartmentModel.find({
      companyId,
      $or: [{ managerId: { $exists: false } }, { managerId: null }],
    }).select("_id name");

    return docs.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
    }));
  }

  async findByManagerId(
    managerId: string
  ): Promise<{ id: string; name: string }[]> {
    const docs = await DepartmentModel.find({ managerId }).exec();
    return docs.map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
    }));
  }
}
