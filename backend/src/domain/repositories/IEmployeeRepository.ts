import { Employee } from "../entities/Employee";
import { EmployeeWithDepartment } from "../../application/interfaces/employees/types";

export interface IEmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findByEmail(email: string): Promise<Employee | null>;
  findByPhone(phone: string): Promise<Employee | null>;
  updatePassword(email: string, password: string): Promise<void>;
  totalEmployeeInADepartment(departmentId: string): Promise<number>;
  findByDepartmentId(departmentId: string): Promise<Employee[]>;
  totalEmployeeInACompany(companyId: string): Promise<number>;
  findByCompanyId(companyId: string): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findByIdWithDepartment(id: string): Promise<EmployeeWithDepartment | null>;
  update(employee: Employee): Promise<Employee>;
}
