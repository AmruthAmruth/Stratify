import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { DepartmentDetailsDTO } from "../../dto/departments/DepartmentDetailsDTO";
import { IGetCompanyDepartmentDetailsUseCase } from "../../interfaces/departments/IGetDepartmentDetailsUseCase";
import { DepartmentMapper } from "../../mappers/DepartmentMapper";

export class GetDepartmentDetailsUseCase
  implements IGetCompanyDepartmentDetailsUseCase {
  constructor(
    private _departmentRepo: IDepartmentRepository,
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
  ) { }

  async execute(departmentId: string): Promise<DepartmentDetailsDTO> {
    const department = await this._departmentRepo.findById(departmentId);
    if (!department) {
      throw new AppError(Messages.DEPARTMENT_NOT_FOUND, StatusCodes.NOT_FOUND);
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


    const employees = await this._employeeRepo.findByDepartmentId(department.id!);
    const teamMembers = DepartmentMapper.toTeamMemberDTOs(employees);


    const departmentDetails = DepartmentMapper.toDepartmentDetailsDTO(
      department,
      headOfDepartment,
      headEmail,
      headPhone,
      headPosition,
      teamMembers,
    );

    return departmentDetails;
  }
}
