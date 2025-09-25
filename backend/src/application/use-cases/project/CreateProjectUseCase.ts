import { Project } from "../../../domain/entities/Project";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateProjectDTO } from "../../dto/project/CreateProjectDTO";
import { ICreateProjectUseCase } from "../../interfaces/project/ICreateProjectUseCase";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository
  ) {}

  async execute(projectDTO: CreateProjectDTO): Promise<Project> {
    let creatorExists = false;
    let companyId: string | undefined;
    let createdByModel: "Company" | "Manager" | undefined;

    const company = await this._companyRepo.findById(projectDTO.createdBy);
    if (company) {
      creatorExists = true;
      companyId = company.id;
      createdByModel = "Company";
    }

    if (!creatorExists) {
      const manager = await this._managerRepo.findById(projectDTO.createdBy);
      if (manager) {
        creatorExists = true;
        companyId = manager.companyId;
        createdByModel = "Manager";
      }
    }

    if (!creatorExists || !companyId || !createdByModel) {
      throw new AppError("Creator not found", 404);
    }

    const department = await this._departmentRepo.findById(projectDTO.departmentId);
    if (!department) {
      throw new AppError("Department not found", 404);
    }

    const existingProject = await this._projectRepo.findByNameAndCompany(
      projectDTO.name,
      companyId
    );
    if (existingProject) {
      throw new AppError("Project name already exists for this company", 400);
    }

    const now = new Date();

    const project = new Project(
      undefined,
      projectDTO.name,
      projectDTO.key,
      projectDTO.description ?? "",
      projectDTO.startDate,
      projectDTO.endDate,
      projectDTO.status ?? "Planned",
      projectDTO.departmentId,
      department.managerId ?? projectDTO.createdBy,
      projectDTO.createdBy,
      createdByModel,
      companyId,
      projectDTO.teamMemberIds ?? [],
      projectDTO.backlogIds ?? [],
      now,  
      now   
    );

    return await this._projectRepo.create(project);
  }
}
