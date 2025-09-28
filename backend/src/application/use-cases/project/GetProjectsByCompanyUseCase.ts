import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { GetProjectsByCompanyDTO, GetProjectsByCompanyResponse } from "../../dto/project/GetProjectsByCompanyDTO";
import { IGetProjectsByCompanyUseCase } from "../../interfaces/project/IGetProjectsByCompanyUseCase";

export class GetProjectsByCompanyUseCase implements IGetProjectsByCompanyUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository
  ) {}

  async execute(companyId: string): Promise<GetProjectsByCompanyResponse> {
    const projects = await this._projectRepo.findByCompanyId(companyId);
  console.log(projects);
  
    if (!projects || projects.length === 0) { 
      throw new AppError("Projects not found", StatusCodes.NOT_FOUND);
    }

    const result: GetProjectsByCompanyDTO[] = await Promise.all(
      projects.map(async (project) => {
        const lead = project.projectLeadId
          ? await this._managerRepo.findById(project.projectLeadId)
          : null; 
 
        const department = project.departmentId
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
          id:project.id,
          projectName: project.name ?? "Unnamed Project",
          projectDescription: project.description ?? "No description",
          departmentName: department?.name ?? "N/A",
          projectLead: lead?.name ?? "N/A",
          status: project.status ?? "Planned",
          remainingTimeInDays,
        };
      })
    );

    
    const counts = {
      total: result.length,
      planned: result.filter((p) => p.status === "Planned").length,
      active: result.filter((p) => p.status === "Active").length,
      completed: result.filter((p) => p.status === "Completed").length,
      archived: result.filter((p) => p.status === "Archived").length,
    };

    return { projects: result, counts };
  }
}
