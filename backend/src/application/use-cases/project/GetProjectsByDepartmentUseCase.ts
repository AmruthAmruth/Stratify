import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { GetProjectsByDepartmentDTO, GetProjectsByDepartmentResponse } from "../../dto/project/GetProjectsByDepartmentDTO";
import { IGetProjectsByDepartmentUseCase } from "../../interfaces/project/IGetProjectsByDepartmentUseCase";

export class GetProjectsByDepartmentUseCase implements IGetProjectsByDepartmentUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _managerRepo: IManagerRepository
  ) {}

  async execute(managerId: string): Promise<GetProjectsByDepartmentResponse> {
    
    const manager = await this._managerRepo.findById(managerId);

    if (!manager) {
      throw new AppError("Manager not found", StatusCodes.NOT_FOUND);
    }

    const departmentId = manager.departmentId;
    if (!departmentId) {
      throw new AppError("Manager does not belong to any department", StatusCodes.NOT_FOUND);
    }

   
    const projects = await this._projectRepo.findByDepartmentId(departmentId);

    if (!projects || projects.length === 0) {
      throw new AppError("Projects not found", StatusCodes.NOT_FOUND);
    }

    const counts = {
      total: projects.length,
      planned: 0,
      active: 0,
      completed: 0,
      archived: 0,
    };

    const result: GetProjectsByDepartmentDTO[] = projects.map((project) => {
      const remainingTimeInDays = project.endDate
        ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const status = project.status ?? "Planned";

      
      if (status === "Planned") counts.planned++;
      if (status === "Active") counts.active++;
      if (status === "Completed") counts.completed++;
      if (status === "Archived") counts.archived++;

      return {
        projectName: project.name ?? "Unnamed Project",
        projectDescription: project.description ?? "No description",
        status,
        remainingTimeInDays,
      };
    });

    return { projects: result, counts };
  }
}
