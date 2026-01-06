import { Manager } from "../../domain/entities/Manager";
import { IManagerRepository } from "../../domain/repositories/IManagerRepository";
import { ManagerModel, ManagerDocument } from "../models/ManagerModel";
import { ManagerMapper } from "../mappers/ManagerMapper";
import { ManagerWithDepartment } from "../../application/interfaces/managers/types";
import { BaseRepository } from "./BaseRepository";

export class ManagerRepository extends BaseRepository<Manager, ManagerDocument> implements IManagerRepository {
  constructor() {
    super(ManagerModel, ManagerMapper);
  }

  async findByEmail(email: string): Promise<Manager | null> {
    return this.findOne({ email });
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await ManagerModel.updateOne({ email }, { $set: { password } });
  }

  async getUnassignedManagers(
    companyId: string,
  ): Promise<{ id: string; name: string }[]> {
    const docs = await ManagerModel.find({
      companyId,
      $or: [{ departmentId: { $exists: false } }, { departmentId: null }],
    }).select("_id name");

    return docs.map((doc) => ({ id: doc.id.toString(), name: doc.name }));
  }

  async totalManagerInACompany(companyId: string): Promise<number> {
    return this.count({ companyId });
  }

  async findByCompanyId(companyId: string): Promise<Manager[]> {
    return this.findMany({ companyId });
  }

  async updatePartial(id: string, data: Partial<Manager>): Promise<Manager | null> {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.dob) updateData.dob = data.dob;
    if (data.profileImage) updateData.profileImage = data.profileImage;
    if (data.address !== undefined) updateData.address = data.address;

    const doc = await ManagerModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!doc) return null;
    return ManagerMapper.toEntity(doc);
  }

  async findByIdWithDepartment(id: string): Promise<ManagerWithDepartment | null> {
    const doc = await ManagerModel.findById(id)
      .populate('departmentId', 'name')
      .exec();
    if (!doc) return null;
    return doc as unknown as ManagerWithDepartment;
  }
}
