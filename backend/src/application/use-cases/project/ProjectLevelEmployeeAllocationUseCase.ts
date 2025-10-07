import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { ProjectLevelEmployeeAllocationDTO } from "../../dto/project/ProjectLavelEmployeeAllocationDTO";
import { IProjectLevelEmployeeAllocationUseCase } from "../../interfaces/project/IProjectLeavelEmployeeAllocationUseCase";

export class ProjectLevelEmployeeAllocationUseCase
  implements IProjectLevelEmployeeAllocationUseCase
{
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(managerId: string): Promise<ProjectLevelEmployeeAllocationDTO[]> {
    const manager = await this._managerRepo.findById(managerId);
    if (!manager) {
      throw new AppError("Manager not found", 404);
    }

    const departmentId = manager.departmentId;
    if (!departmentId) {
      throw new AppError("Manager is not assigned to any department", 400);
    }

    const employees = await this._employeeRepo.findByDepartmentId(departmentId);
    if (!employees || employees.length === 0) {
      throw new AppError("No employees found in this department", 404);
    }

    const allocations: ProjectLevelEmployeeAllocationDTO = {
      departmentId,
      employee: employees.map((emp) => ({
        name: emp.name,
        position: emp.position,
        employeeId: emp.id!,
      })),
    };

    return [allocations];
  }
}
