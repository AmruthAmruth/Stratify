import { Project } from "../../../domain/entities/Project";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { validateEmployees } from "../../../shared/utils/EmployeeValidator";
import { UpdateProjectDTO } from "../../dto/project/CreateProjectDTO";
import { IUpdateProjectUseCase } from "../../interfaces/project/IUpdateProjectUseCase";

export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _companyRepo: ICompanyRepository,
    private _managerRepo: IManagerRepository,
    private _departmentRepo: IDepartmentRepository,
    private _employeeRepo: IEmployeeRepository,
  ) { }

  async execute(projectDTO: UpdateProjectDTO): Promise<Project> {
    const existingProject = await this._projectRepo.findById(projectDTO.id!);
    if (!existingProject) {
      throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

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
      throw new AppError(Messages.CREATOR_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const department = await this._departmentRepo.findById(
      projectDTO.departmentId,
    );
    if (!department) {
      throw new AppError(Messages.DEPARTMENT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (department.companyId !== companyId) {
      throw new AppError(Messages.DEPARTMENT_NOT_BELONG_TO_COMPANY, StatusCodes.BAD_REQUEST);
    }

    if (projectDTO.name !== existingProject.name) {
      const nameExists = await this._projectRepo.findByNameAndCompany(
        projectDTO.name,
        companyId,
      );
      if (nameExists && nameExists.id !== projectDTO.id) {
        throw new AppError(
          Messages.PROJECT_NAME_EXISTS,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (projectDTO.key !== existingProject.key) {
      const keyExists = await this._projectRepo.findByKeyAndCompany(
        projectDTO.key,
        companyId,
      );
      if (keyExists && keyExists.id !== projectDTO.id) {
        throw new AppError(
          Messages.PROJECT_KEY_EXISTS,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    await validateEmployees(
      this._employeeRepo,
      projectDTO.teamMemberIds ?? [],
      companyId,
      "Team member",
    );

    const updatedProject = new Project(
      existingProject.id,
      projectDTO.name,
      projectDTO.key,
      projectDTO.description ?? existingProject.description,
      projectDTO.startDate,
      projectDTO.endDate,
      projectDTO.status ?? existingProject.status,
      projectDTO.departmentId,
      department.managerId ?? existingProject.projectLeadId,
      projectDTO.createdBy,
      createdByModel,
      companyId,
      projectDTO.teamMemberIds ?? existingProject.teamMemberIds,
      existingProject.createdAt,
      new Date(), // updatedAt
    );

    return await this._projectRepo.update(updatedProject);
  }
}
