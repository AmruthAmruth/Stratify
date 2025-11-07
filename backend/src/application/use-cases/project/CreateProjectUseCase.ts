import { Project } from "../../../domain/entities/Project";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { emitNotification } from "../../../infrastructure/socket/NotificationSocket";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { io } from "../../../main";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { validateEmployees } from "../../../shared/utils/EmployeeValidator";
import { CreateProjectDTO } from "../../dto/project/CreateProjectDTO";
import { ICreateProjectUseCase } from "../../interfaces/project/ICreateProjectUseCase";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _employeeRepo: IEmployeeRepository,
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

    console.log("Project DTO", projectDTO);

    if (!creatorExists) {
      const manager = await this._managerRepo.findById(projectDTO.createdBy);
      if (manager) {
        creatorExists = true;
        companyId = manager.companyId;
        createdByModel = "Manager";
      }
    }

    if (!creatorExists || !companyId || !createdByModel) {
      throw new AppError("Creator not found", StatusCodes.NOT_FOUND);
    }

    const department = await this._departmentRepo.findById(
      projectDTO.departmentId,
    );
    if (!department) {
      throw new AppError("Department not found", StatusCodes.NOT_FOUND);
    }

    if (department.companyId !== companyId)
      throw new AppError("Department does not belong to creator company", 400);

    const existingProjectName = await this._projectRepo.findByNameAndCompany(
      projectDTO.name,
      companyId,
    );
    if (existingProjectName) {
      throw new AppError(
        "Project name already exists for this company",
        StatusCodes.BAD_REQUEST,
      );
    }

    const existingProjectKey = await this._projectRepo.findByKeyAndCompany(
      projectDTO.key,
      companyId,
    );

    if (existingProjectKey) {
      throw new AppError(
        "Project Key name already exists for this company",
        StatusCodes.BAD_REQUEST,
      );
    }

    await validateEmployees(
      this._employeeRepo,
      projectDTO.teamMemberIds,
      companyId,
      "Team member",
    );

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
      now,
      now,
    );

    emitNotification(io, department.managerId!, "New Project is Created!");

    return await this._projectRepo.create(project);
  }
}
