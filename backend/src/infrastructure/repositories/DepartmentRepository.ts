import { Types } from "mongoose";
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


  async findById(id: string): Promise<Department | null> {
    console.log("Department ID", id);
    
    const doc = await DepartmentModel.findById(id);
    if(!doc) return null;
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

async assignManager(departmentId: string, managerId: string): Promise<void> {
  await DepartmentModel.findByIdAndUpdate(
    new Types.ObjectId(departmentId),
    { managerId: new Types.ObjectId(managerId) },
    { new: true } 
  ).exec();
}

async findDepartmentsByCompanyId(companyId: string): Promise<Department[]> {
  const docs = await DepartmentModel.find({ companyId }).exec();
  return docs.map(doc => 
    new Department(
      doc.id.toString(),
      doc.name,
      doc.description,
      doc.companyId.toString(),
      doc.managerId?.toString(),
      doc.createdAt,
      doc.updatedAt
    )
  );
}



  async getUnassignedDepartments(companyId:string): Promise<{id:string,name:string}[]> {
   const docs = await DepartmentModel.find({
       companyId: companyId, 
       $or: [
         { managerId: { $exists: false } },
         { managerId: null }
       ]
     }).select("_id name");
   
     return docs.map(doc => ({
       id: doc.id.toString(), 
       name: doc.name
     }));
}


async findByManagerId(managerId: string): Promise<{ id: string; name: string }[]> {
  const docs = await DepartmentModel.find({ managerId }).exec();
  return docs.map(doc => ({
    id: doc.id.toString(),
    name: doc.name
  }));
}

}
