import { Employee } from "../../domain/entities/Employee";
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { EmployeeModel } from "../models/EmployeeModel";

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

    return new Employee(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.password,
      doc.companyId.toString(),
      doc.departmentId.toString(),
      doc.gender,
      doc.role,
      doc.managerId ? doc.managerId.toString() : undefined,
      doc.profileImage ?? undefined,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ email });
    if (!doc) return null;

    return new Employee(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.password,
      doc.companyId.toString(),
      doc.departmentId.toString(),
      doc.gender,
      doc.role,
      doc.managerId ? doc.managerId.toString() : undefined,
      doc.profileImage ?? undefined,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findByPhone(phone: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findOne({ phone });
    if (!doc) return null;

    return new Employee(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.password,
      doc.companyId.toString(),
      doc.departmentId.toString(),
      doc.gender,
      doc.role,
      doc.managerId ? doc.managerId.toString() : undefined,
      doc.profileImage ?? undefined,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await EmployeeModel.findById(id);
    if (!doc) return null;

    return new Employee(
      doc.id.toString(),
      doc.name,
      doc.email,
      doc.phone,
      doc.dob,
      doc.joiningDate,
      doc.position,
      doc.password,
      doc.companyId.toString(),
      doc.departmentId.toString(),
      doc.gender,
      doc.role,
      doc.managerId ? doc.managerId.toString() : undefined,
      doc.profileImage ?? undefined,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async updatePassword(email: string, password: string): Promise<void> {
      await EmployeeModel.updateOne({ email }, { $set: { password } });
  }

 async totalEmployeeInADepartment(departmentId: string): Promise<number> {
  return await EmployeeModel.countDocuments({ departmentId });
}


async findByDepartmentId(departmentId: string): Promise<Employee[]> {
   const docs = await EmployeeModel.find({ departmentId });

  return docs.map(doc => new Employee(
    doc.id.toString(),
    doc.name,
    doc.email,
    doc.phone,
    doc.dob,
    doc.joiningDate,
    doc.position,
    doc.password,
    doc.companyId.toString(),
    doc.departmentId.toString(),
    doc.gender,
    doc.role,
    doc.managerId ? doc.managerId.toString() : undefined,
    doc.profileImage ?? undefined,
    doc.createdAt,
    doc.updatedAt
  ));
}

async totalEmployeeInACompany(companyId: string): Promise<number> {
  return await EmployeeModel.countDocuments({companyId})
}

async findByCompanyId(companyId: string): Promise<Employee[]> {
  const docs = await EmployeeModel.find({ companyId });
    return docs.map(doc => new Employee(
  doc.id.toString(),
  doc.name,
  doc.email,
  doc.phone,
  doc.dob,
  doc.joiningDate,
  doc.position,
  doc.password,
  doc.companyId.toString(),
  doc.departmentId?.toString(),
  doc.gender,
  doc.role,
  doc.managerId ? doc.managerId.toString() : undefined,
  doc.profileImage ?? undefined,
  doc.createdAt,
  doc.updatedAt
));
}


}
