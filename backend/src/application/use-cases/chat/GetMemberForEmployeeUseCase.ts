import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import {
  GetMemberForEmployee,
  MemberDTO,
} from "../../dto/chat/GetMemberForEmployeeDTO";
import { IGetmemberForEmployeeUseCase } from "../../interfaces/chat/IGetMemberForEmployeeUseCase";

export class GetMemberForEmployeeUseCase
  implements IGetmemberForEmployeeUseCase
{
  constructor(
    private _employeeRepo: IEmployeeRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _companyRepo: ICompanyRepository,
  ) {}

  async execute(employeeId: string): Promise<GetMemberForEmployee> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const department = await this._departmentRepo.findById(
      employee.departmentId!,
    );
    if (!department) {
      throw new AppError("Department not found", 404);
    }

    const manager = await this._managerRepo.findById(department.managerId!);
    if (!manager) {
      throw new AppError("Manager not found", 404);
    }

    const employees = await this._employeeRepo.findByDepartmentId(
      department.id!,
    );
    if (!employees || employees.length === 0) {
      throw new AppError("No employees found in this department", 404);
    }

    const company = await this._companyRepo.findById(employee.companyId);
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    const employeesDTO: MemberDTO[] = employees.map((emp) => ({
      id: emp.id!,
      name: emp.name,
      position: emp.position,
      role: "Employee",
    }));

    return {
      company: {
        id: company.id,
        name: company.name,
      },
      manager: {
        id: manager.id,
        name: manager.name,
      },
      employees: employeesDTO,
    };
  }
}
