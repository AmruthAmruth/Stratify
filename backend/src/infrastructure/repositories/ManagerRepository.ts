import { Types } from "mongoose";
import { Manager } from "../../domain/entities/Manager";
import { IManagerRepository } from "../../domain/repositories/IManagerRepository";
import { ManagerModel } from "../models/ManagerModel";
import { ManagerMapper } from "../mappers/ManagerMapper";

export class ManagerRepository implements IManagerRepository {
  async create(manager: Manager): Promise<Manager> {
    const doc = await ManagerModel.create({
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      password: manager.password,
      role: manager.role,
      position: manager.position,
      joiningDate: manager.joiningDate,
      gender: manager.gender,
      dob: manager.dob,
      companyId: new Types.ObjectId(manager.companyId),
      departmentId: manager.departmentId
        ? new Types.ObjectId(manager.departmentId)
        : undefined,
      profileImage: manager.profileImage,
    });

    return ManagerMapper.toEntity(doc);
  }

  async findById(id: string): Promise<Manager | null> {
    const doc = await ManagerModel.findById(id).exec();
    if (!doc) return null;
    return ManagerMapper.toEntity(doc);
  }

  async findByEmail(email: string): Promise<Manager | null> {
    const doc = await ManagerModel.findOne({ email }).exec();
    if (!doc) return null;
    return ManagerMapper.toEntity(doc);
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await ManagerModel.updateOne({ email }, { $set: { password } });
  }

  async getUnassignedManagers(companyId: string): Promise<{ id: string; name: string }[]> {
    const docs = await ManagerModel.find({
      companyId,
      $or: [{ departmentId: { $exists: false } }, { departmentId: null }],
    }).select("_id name");

    return docs.map((doc) => ({ id: doc.id.toString(), name: doc.name }));
  }

  async totalManagerInACompany(companyId: string): Promise<number> {
    return await ManagerModel.countDocuments({ companyId });
  }

  async findByCompanyId(companyId: string): Promise<Manager[]> {
    const docs = await ManagerModel.find({ companyId }).exec();
    return ManagerMapper.toEntities(docs);
  }
}
