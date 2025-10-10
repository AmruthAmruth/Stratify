import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IssueLevelEmployeeAllocationDTO } from "../../dto/project/IssueLeavelEmployeeAllocationDTO";
import { IGetEmployeeNotInProjectUseCase } from "../../interfaces/project/IGetEmployeeNotInProjectUseCase";

export class GetEmployeeNotInProjectUseCase implements IGetEmployeeNotInProjectUseCase {

  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _employeeRepo: IEmployeeRepository
  ) {}

  async execute(projectId: string): Promise<IssueLevelEmployeeAllocationDTO[]> {
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }


   const departmentId = project.departmentId;
    if (!departmentId) {
      throw new AppError("Project does not have a department assigned", StatusCodes.BAD_REQUEST);
    }

    const departmentEmployees = await this._employeeRepo.findByDepartmentId(departmentId);
    if (!departmentEmployees || departmentEmployees.length === 0) {
      throw new AppError("No employees found in this department", StatusCodes.NOT_FOUND);
    }



       const projectEmployeeIds: string[] = project.teamMemberIds || [];


    const availableEmployees = departmentEmployees
      .filter((emp) => emp.id) 
      .filter((emp) => !projectEmployeeIds.includes(emp.id!));

      const result: IssueLevelEmployeeAllocationDTO[] = availableEmployees.map((emp) => ({
      name: emp.name,
      employeeId: emp.id!,
      role: emp.role,
    }));

    return result;
  }
}
