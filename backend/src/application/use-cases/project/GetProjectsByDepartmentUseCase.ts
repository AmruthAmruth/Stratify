import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { GetProjectsByDepartmentDTO } from "../../dto/project/GetProjectsByDepartmentDTO";
import { IGetProjectsByDepartmentUseCase } from "../../interfaces/project/IGetProjectsByDepartmentUseCase";

export class GetProjectsByDepartmentUseCase implements IGetProjectsByDepartmentUseCase {
  constructor(private _projectRepo: IProjectRepository) {}

  async execute(departmentId: string): Promise<GetProjectsByDepartmentDTO[]> {
   
    
    const projects = await this._projectRepo.findByDepartmentId(departmentId);

    if (!projects || projects.length === 0) {
      throw new AppError("Projects not found", StatusCodes.NOT_FOUND);
    }

    const result: GetProjectsByDepartmentDTO[] = projects.map((project) => {
      const remainingTimeInDays = project.endDate
        ? Math.ceil(
            (new Date(project.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

      return {
        projectName: project.name ?? "Unnamed Project",
        projectDescription: project.description ?? "No description",
        status: project.status ?? "Planned",
        remainingTimeInDays,
      };
    });

    return result;
  }
}
