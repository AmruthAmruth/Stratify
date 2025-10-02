import { Employee } from "../../domain/entities/Employee";
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { EmployeeModel } from "../models/EmployeeModel";
import { EmployeeMapper } from "../mappers/EmployeeMapper";

export class EmployeeRepository implements IEmployeeRepository {
  async create(employee: Employee): Promise<Employee> {
    const doc = await EmployeeModel.create({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      dob: employee.dob,
      joiningDate: employee.joiningDate,
      position: employee.position,
      password: employee.password,
      companyId: employee.companyId,
      departmentId: employee.departmentId,
      managerId: employee.managerId || null,
      profileImage: employee.profileImage || null,
      gender: employee.gender,
      role: employee.role,
    });

    return EmployeeMapper.toEntity(doc);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ email }).exec();
    if (!doc) return null;

    return EmployeeMapper.toEntity(doc);
  }

  async findByPhone(phone: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ phone }).exec();
    if (!doc) return null;

    return EmployeeMapper.toEntity(doc);
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findById(id).exec();
    if (!doc) return null;

    return EmployeeMapper.toEntity(doc);
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await EmployeeModel.updateOne({ email }, { $set: { password } }).exec();
  }

  async totalEmployeeInADepartment(departmentId: string): Promise<number> {
    return await EmployeeModel.countDocuments({ departmentId }).exec();
  }

  async findByDepartmentId(departmentId: string): Promise<Employee[]> {
    const docs = await EmployeeModel.find({ departmentId }).exec();
    return EmployeeMapper.toEntities(docs);
  }

  async totalEmployeeInACompany(companyId: string): Promise<number> {
    return await EmployeeModel.countDocuments({ companyId }).exec();
  }

  async findByCompanyId(companyId: string): Promise<Employee[]> {
    const docs = await EmployeeModel.find({ companyId }).exec();
    return EmployeeMapper.toEntities(docs);
  }
}
