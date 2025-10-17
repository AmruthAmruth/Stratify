import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import {
  DepartmentDetailsDTO,
  TeamMemberDTO,
} from "../../dto/departments/DepartmentDetailsDTO";
import { IGetCompanyDepartmentDetailsUseCase } from "../../interfaces/departments/IGetDepartmentDetailsUseCase";

export class GetDepartmentDetailsUseCase
  implements IGetCompanyDepartmentDetailsUseCase
{
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
  ) {}
  async execute(departmentId: string): Promise<DepartmentDetailsDTO> {
    const department = await this._departmentRepo.findById(departmentId);
    if (!department) {
      throw new AppError("Department Not Found", StatusCodes.NOT_FOUND);
    }

    let headOfDepartment: string | undefined;
    let headEmail: string | undefined;
    let headPhone: string | undefined;
    let headPosition: string | undefined;

    if (department.managerId) {
      const manager = await this._managerRepo.findById(department.managerId);
      if (manager) {
        headOfDepartment = manager.name;
        headEmail = manager.email;
        headPhone = manager.phone;
        headPosition = manager.position;
      }
    }

    const employees = await this._employeeRepo.findByDepartmentId(
      department.id!,
    );
    const teamMembers: TeamMemberDTO[] = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      email: emp.email,
      phone: emp.phone,
    }));

    const departmentDetails: DepartmentDetailsDTO = {
      departmentName: department.name,
      description: department.description ?? "",
      headOfDepartment,
      headEmail,
      headPhone,
      headPosition,
      teamMembers,
    };
    return departmentDetails;
  }
}
