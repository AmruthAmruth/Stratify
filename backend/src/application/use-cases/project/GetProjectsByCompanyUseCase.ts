import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { GetProjectsByCompanyDTO } from "../../dto/project/GetProjectsByCompanyDTO";
import { IGetProjectsByCompanyUseCase } from "../../interfaces/project/IGetProjectsByCompanyUseCase";

export class GetProjectsByCompanyUseCase implements IGetProjectsByCompanyUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository
  ) {}

  async execute(companyId: string): Promise<GetProjectsByCompanyDTO[]> {
    const projects = await this._projectRepo.findByCompanyId(companyId);

    if (!projects || projects.length === 0) {
      throw new AppError("Projects not found", StatusCodes.NOT_FOUND);
    }

    const result: GetProjectsByCompanyDTO[] = await Promise.all(
      projects.map(async (project) => {
       
        const lead =
          project.projectLeadId
            ? await this._managerRepo.findById(project.projectLeadId)
            : null;

        const department =
          project.departmentId
            ? await this._departmentRepo.findById(project.departmentId)
            : null;

        let remainingTimeInDays = 0;
        if (project.endDate) {
          remainingTimeInDays = Math.ceil(
            (new Date(project.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
        }

        return {
          projectName: project.name ?? "Unnamed Project",
          projectDescription: project.description ?? "No description",
          departmentName: department?.name ?? "N/A",
          projectLead: lead?.name ?? "N/A",
          status: project.status ?? "Planned",
          remainingTimeInDays,
        };
      })
    );

    return result;
  }
}
