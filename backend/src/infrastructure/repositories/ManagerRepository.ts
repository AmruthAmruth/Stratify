import mongoose, { Document } from "mongoose";
import { Manager } from "../../domain/entities/Manager";
import { IManagerRepo } from "../../domain/repositories/IManagerRepository";
import ManagerModel, { IManagerDoc } from "../models/ManagerModel";

export class ManagerRepository implements IManagerRepo {
  private mapToEntity(doc: IManagerDoc & Document): Manager {
    const _id = doc._id as mongoose.Types.ObjectId;
    const departmentId = doc.departmentId as mongoose.Types.ObjectId;
    const companyId = doc.companyId as mongoose.Types.ObjectId;

    return new Manager(
      _id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.status,
      departmentId?.toString(),
      companyId?.toString(),
      doc.password,
      doc.role,
      doc.joiningDate,
      doc.profileImage
    );
  }

  async create(manager: Partial<Manager>): Promise<Manager> {
    const doc = await ManagerModel.create({
      ...manager,
      companyId: new mongoose.Types.ObjectId(manager.companyId),
      departmentId: new mongoose.Types.ObjectId(manager.departmentId),
    });
    return this.mapToEntity(doc);
  }

  async findByEmail(email: string): Promise<Manager | null> {
    const doc = await ManagerModel.findOne({ email });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByCompanyId(id: string): Promise<Manager[]> {
    const docs = await ManagerModel.find({ companyId: id });
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await ManagerModel.updateOne({ email }, { $set: { password } });
  }

  async findById(id: string): Promise<Manager | null> {
    const doc = await ManagerModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }
}
