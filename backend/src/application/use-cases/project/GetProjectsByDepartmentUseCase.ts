import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
  GetProjectsByDepartmentDTO,
  GetProjectsByDepartmentResponse,
} from "../../dto/project/GetProjectsByDepartmentDTO";
import { IGetProjectsByDepartmentUseCase } from "../../interfaces/project/IGetProjectsByDepartmentUseCase";

export class GetProjectsByDepartmentUseCase
  implements IGetProjectsByDepartmentUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _managerRepo: IManagerRepository,
  ) { }

  async execute(managerId: string): Promise<GetProjectsByDepartmentResponse> {
    const manager = await this._managerRepo.findByIdWithDepartment(managerId);

    if (!manager) {
      throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Handle populated departmentId (it's an object with _id and name when populated)
    const departmentId = manager.departmentId?._id?.toString();
    if (!departmentId) {
      throw new AppError(
        Messages.MANAGER_NO_DEPARTMENT,
        StatusCodes.NOT_FOUND,
      );
    }

    const projects = await this._projectRepo.findByDepartmentId(departmentId);

    // Return empty array if no projects - this is a valid state for new departments
    const projectsList = projects || [];

    const counts = {
      total: projectsList.length,
      planned: 0,
      active: 0,
      completed: 0,
      archived: 0,
    };

    const result: GetProjectsByDepartmentDTO[] = projectsList.map((project) => {
      const remainingTimeInDays = project.endDate
        ? Math.ceil(
          (new Date(project.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
        )
        : 0;

      const status = project.status ?? "Planned";

      if (status === "Planned") counts.planned++;
      if (status === "Active") counts.active++;
      if (status === "Completed") counts.completed++;
      if (status === "Archived") counts.archived++;

      return {
        id: project.id,
        projectName: project.name ?? "Unnamed Project",
        projectDescription: project.description ?? "No description",
        status,
        remainingTimeInDays,
      };
    });

    return { projects: result, departmentId, counts };
  }
}
