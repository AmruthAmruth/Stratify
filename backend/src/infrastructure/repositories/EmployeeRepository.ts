import { Employee } from "../../domain/entities/Employee";
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { EmployeeModel, EmployeeDocument } from "../models/EmployeeModel";
import { EmployeeMapper } from "../mappers/EmployeeMapper";
import { EmployeeWithDepartment } from "../../application/interfaces/employees/types";
import { BaseRepository } from "./BaseRepository";

export class EmployeeRepository extends BaseRepository<Employee, EmployeeDocument> implements IEmployeeRepository {
  constructor() {
    super(EmployeeModel, EmployeeMapper);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.findOne({ email });
  }

  async findByPhone(phone: string): Promise<Employee | null> {
    return this.findOne({ phone });
  }

  async updatePassword(email: string, password: string): Promise<void> {
    await EmployeeModel.updateOne({ email }, { $set: { password } }).exec();
  }

  async totalEmployeeInADepartment(departmentId: string): Promise<number> {
    return this.count({ departmentId });
  }

  async findByDepartmentId(departmentId: string): Promise<Employee[]> {
    return this.findMany({ departmentId });
  }

  async totalEmployeeInACompany(companyId: string): Promise<number> {
    return this.count({ companyId });
  }

  async findByCompanyId(companyId: string): Promise<Employee[]> {
    return this.findMany({ companyId });
  }

  async findByIdWithDepartment(id: string): Promise<EmployeeWithDepartment | null> {
    const doc = await EmployeeModel.findById(id).populate("departmentId", "name").exec();
    if (!doc) return null;

    const department = doc.departmentId as unknown as { _id: string; name: string };

    return {
      ...EmployeeMapper.toEntity(doc),
      departmentId: {
        _id: department._id.toString(),
        name: department.name,
      },
    };
  }
}
