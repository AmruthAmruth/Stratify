import mongoose from "mongoose";
import { Employee } from "../../domain/entities/Employee";
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import EmployeeModel, { IEmployeeDoc } from "../models/EmployeeModel";

export class EmployeeRepository implements IEmployeeRepository {

  async create(employee: Employee): Promise<Employee> {
    const doc = await EmployeeModel.create({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      dob: employee.dob,
      joiningDate: employee.joiningDate,
      position: employee.position,
      managerId: employee.managerId,
      profileImage: employee.profileImage,
      departmentId: employee.departmentId,
      companyId: employee.companyId,
      password: employee.password,
      status: employee.status,
      role: employee.role,
    });

    return this.mapToEntity(doc);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ email });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByPhone(phone: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ phone });
    return doc ? this.mapToEntity(doc) : null;
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await EmployeeModel.updateOne({ email }, { $set: { password } });
  }

async findByDepartmentId(departmentId: string): Promise<Employee[]> {
  const docs = await EmployeeModel.find({
    departmentId: departmentId, 
  });

  return docs.map((doc) => this.mapToEntity(doc));
}


async findByCompanyId(id: string): Promise<Employee[]> {
  const companyObjectId = new mongoose.Types.ObjectId(id);

  const docs = await EmployeeModel.find({ companyId: companyObjectId });
  return docs.map((doc) => this.mapToEntity(doc));
}



  

  private mapToEntity(doc:IEmployeeDoc): Employee {
    return new Employee(
      (doc._id as mongoose.Types.ObjectId).toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.managerId?.toString(),
      doc.profileImage,
      (doc.departmentId as mongoose.Types.ObjectId).toString(),
      (doc.companyId as mongoose.Types.ObjectId).toString(),
      doc.password,
      doc.status,
      doc.role,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
 