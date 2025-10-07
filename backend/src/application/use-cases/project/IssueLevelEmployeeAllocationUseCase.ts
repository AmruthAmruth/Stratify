import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ProjectLevelEmployeeAllocationDTO } from "../../dto/project/ProjectLavelEmployeeAllocationDTO";
import { IIssueLevelEmployeeAllocation } from "../../interfaces/project/IIssueLevelEmployeeAllocationUseCase";

export class IssueLevelEmployeeAllocationUseCase implements IIssueLevelEmployeeAllocation {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _employeeRepo: IEmployeeRepository
  ) {}

  async execute(projectId: string): Promise<ProjectLevelEmployeeAllocationDTO> {
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }

    if (!project.teamMemberIds || project.teamMemberIds.length === 0) {
      throw new AppError(
        "No team members assigned to this project",
        StatusCodes.BAD_REQUEST
      );
    }

   
    
    const employeeList = await Promise.all(
      project.teamMemberIds.map(async (employeeId) => {
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
          throw new AppError(
            `Employee not found: ${employeeId}`,
            StatusCodes.NOT_FOUND
          );
        }

        return {
          name: employee.name,
          position: employee.position,
          employeeId: employee.id!,
        };
      })
    );

    
    const allocation: ProjectLevelEmployeeAllocationDTO = {
      departmentId: project.departmentId ?? "N/A", 
      employee: employeeList,
    };

    return allocation;
  }
}
