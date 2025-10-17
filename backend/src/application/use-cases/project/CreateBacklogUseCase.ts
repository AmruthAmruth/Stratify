import { Backlog } from "../../../domain/entities/Backlog";
import { IBacklogRepository } from "../../../domain/repositories/IBacklogRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateBacklogDTO } from "../../dto/project/CreateBacklogDTO";
import { ICreateBacklogUseCase } from "../../interfaces/project/ICreateBacklogUseCase";

export class CreateBacklogUseCase implements ICreateBacklogUseCase {
  constructor(
    private _backlogRepo: IBacklogRepository,
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _projectRepo: IProjectRepository,
  ) {}

  async execute(backlogDTO: CreateBacklogDTO): Promise<Backlog> {
    let creatorExists = false;
    let createdByModel: "Company" | "Manager" | undefined;
    let companyId: string | undefined;

    const company = await this._companyRepo.findById(backlogDTO.createdBy);
    if (company) {
      creatorExists = true;
      createdByModel = "Company";
      companyId = company.id;
    }

    if (!creatorExists) {
      const manager = await this._managerRepo.findById(backlogDTO.createdBy);
      if (manager) {
        creatorExists = true;
        createdByModel = "Manager";
        companyId = manager.companyId;
      }
    }

    if (!creatorExists || !createdByModel || !companyId) {
      throw new AppError("Creator not found", StatusCodes.BAD_REQUEST);
    }

    const project = await this._projectRepo.findById(backlogDTO.projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.BAD_REQUEST);
    }

    if (project.companyId !== companyId) {
      throw new AppError(
        "Project does not belong to the creator's company",
        StatusCodes.BAD_REQUEST,
      );
    }

    const existingBacklog = await this._backlogRepo.findByNameAndProject(
      backlogDTO.name,
      backlogDTO.projectId,
    );
    if (existingBacklog) {
      throw new AppError(
        "Backlog name already exists in this project",
        StatusCodes.BAD_REQUEST,
      );
    }

    const backlog = new Backlog(
      undefined,
      backlogDTO.projectId,
      backlogDTO.name,
      backlogDTO.description,
      backlogDTO.createdBy,
      new Date(),
      new Date(),
    );

    return await this._backlogRepo.create(backlog);
  }
}
