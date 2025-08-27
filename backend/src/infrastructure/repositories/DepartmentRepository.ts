import mongoose from "mongoose";
import { Department } from "../../domain/entities/Department";
import { IDepartmentRepo } from "../../domain/repositories/IDepartmentRepository";
import DepartmentModel, { IDepartmentDoc } from "../models/DepartmentModel";

export class DepartmentRepository implements IDepartmentRepo {

  async create(dept: Partial<Department>): Promise<Department> {
    const doc: IDepartmentDoc = await DepartmentModel.create({
      ...dept,
      companyId: new mongoose.Types.ObjectId(dept.companyId),
      managerId: dept.managerId ? new mongoose.Types.ObjectId(dept.managerId) : undefined,
       description: dept.description,    
    status: dept.status || "active",   
    });

    return new Department(
      doc._id.toString(),
      doc.name,
      doc.companyId.toString(),
      doc.managerId?.toString(),
      doc.description,
       doc.status
      
    );
  }

  async update(dept: Department): Promise<void> {
    await DepartmentModel.findByIdAndUpdate(dept.id, {
      managerId: dept.managerId ? new mongoose.Types.ObjectId(dept.managerId) : undefined,
    });
  }
}
