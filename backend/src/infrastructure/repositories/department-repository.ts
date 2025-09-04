import mongoose from "mongoose";
import { Department } from "../../domain/entities/department";
import { IDepartmentRepo } from "../../domain/repositories/i-department-repository";
import DepartmentModel, { IDepartmentDoc } from "../models/department-model";


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

  


  async findById(id: string): Promise<Department|null> {
   return await DepartmentModel.findById(id)
  }

async getAllDepartment(id: string): Promise<Department[]> {
  const docs = await DepartmentModel.find({ companyId: id });
  return docs.map(
    (doc) =>
      new Department(
        doc._id.toString(),
        doc.name,
        doc.companyId.toString(),
        doc.managerId?.toString(),
        doc.description,
        doc.status
      )
  );
}


async updatePassword(email: string, password: string): Promise<void> {
  await DepartmentModel.updateOne(
      { email },                 
      { $set: { password } }     
    );
}

   
}
