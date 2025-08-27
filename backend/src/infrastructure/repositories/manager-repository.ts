import mongoose from "mongoose";
import { Manager } from "../../domain/entities/manager";
import { IManagerRepo } from "../../domain/repositories/i-manager-repository";
import ManagerModel from "../models/manager-model";

export class ManagerRepository implements IManagerRepo {
  async create(manager: Partial<Manager>): Promise<Manager> {
    const doc = await ManagerModel.create({
      ...manager,
      companyId: new mongoose.Types.ObjectId(manager.companyId),
      departmentId: new mongoose.Types.ObjectId(manager.departmentId),
    });

    const _id = doc._id as mongoose.Types.ObjectId;
    const departmentId = doc.departmentId as mongoose.Types.ObjectId;
    const companyId = doc.companyId as mongoose.Types.ObjectId;

    return new Manager(
      _id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.password,
      doc.role,
      doc.status,
      departmentId.toString(),
      companyId.toString(),
      doc.joiningDate,    
      doc.profileImage   
    );
  }

  async findByEmail(email: string): Promise<Manager | null> {
    const doc = await ManagerModel.findOne({ email });
    if (!doc) return null;

    const _id = doc._id as mongoose.Types.ObjectId;
    const departmentId = doc.departmentId as mongoose.Types.ObjectId;
    const companyId = doc.companyId as mongoose.Types.ObjectId;

    return new Manager(
      _id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.password,
      doc.role,
      doc.status,
      departmentId.toString(),
      companyId.toString(),
      doc.joiningDate,     
        doc.profileImage  
    );
  }
}
