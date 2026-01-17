import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { ProjectLevelEmployeeAllocationDTO } from "../../dto/project/ProjectLavelEmployeeAllocationDTO";
import { IProjectLevelEmployeeAllocationUseCase } from "../../interfaces/project/IProjectLeavelEmployeeAllocationUseCase";

export class ProjectLevelEmployeeAllocationUseCase
  implements IProjectLevelEmployeeAllocationUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository
  ) { }

  async execute(
    managerId: string,
  ): Promise<ProjectLevelEmployeeAllocationDTO[]> {
    const manager = await this._managerRepo.findByIdWithDepartment(managerId);
    if (!manager) {
      throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    
    const departmentId = manager.departmentId?._id?.toString();
    if (!departmentId) {
      throw new AppError(Messages.MANAGER_NO_DEPARTMENT, StatusCodes.BAD_REQUEST);
    }

    const employees = await this._employeeRepo.findByDepartmentId(departmentId);

    
    const employeeList = employees || [];

    const allocations: ProjectLevelEmployeeAllocationDTO = {
      departmentId,
      employee: employeeList.map((emp) => ({
        name: emp.name,
        position: emp.position,
        employeeId: emp.id!,
      })),
    };

    return [allocations];
  }
}
