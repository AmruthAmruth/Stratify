import { Types } from "mongoose";
import { Department } from "../../domain/entities/Department";
import { IDepartmentRepository } from "../../domain/repositories/IDepartmentRepository";
import { DepartmentModel, DepartmentDocument } from "../models/DepartmentModel";
import { DepartmentMapper } from "../mappers/DepartmentMapper";
import { BaseRepository } from "./BaseRepository";

export class DepartmentRepository extends BaseRepository<Department, DepartmentDocument> implements IDepartmentRepository {
  constructor() {
    super(DepartmentModel, DepartmentMapper);
  }

  async findByNameAndCompany(
    name: string,
    // companyId: string // Parameter kept for signature compatibility during transition, but not used in query
  ): Promise<Department | null> {
    const normalizedName = name.toLowerCase().trim();
    // The TenantPlugin will automatically inject { companyId } into this findOne.
    return this.findOne({
      normalizedName,
    });
  }

  async assignManager(departmentId: string, managerId: string): Promise<void> {
    await DepartmentModel.findByIdAndUpdate(
      new Types.ObjectId(departmentId),
      { managerId: new Types.ObjectId(managerId) },
      { new: true }
    ).exec();
  }

  async findDepartmentsByCompanyId(_companyId: string): Promise<Department[]> {
    // TenantPlugin handles companyId injection automatically via `findMany({})` which hooks into `find`
    return this.findMany({});
  }

  async getUnassignedDepartments(
    _companyId: string
  ): Promise<{ id: string; name: string }[]> {
    const docs = await DepartmentModel.find({
      // companyId is automatically injected by TenantPlugin
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
