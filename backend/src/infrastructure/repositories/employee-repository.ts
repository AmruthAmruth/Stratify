import mongoose from "mongoose";
import { Employee } from "../../domain/entities/employee";
import { IEmployeeRepository } from "../../domain/repositories/i-employee-repository";
import EmployeeModel from "../models/employee-model";


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

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ email });
    if (!doc) return null;

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

  async findByPhone(phone: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ phone });
    if (!doc) return null;

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