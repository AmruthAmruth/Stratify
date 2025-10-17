import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IAddEmployeeProjectUseCase } from "../../interfaces/project/IAddEmployeeProjectUseCase";

export class AddEmployeeProjectUseCase implements IAddEmployeeProjectUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _employeeRepo: IEmployeeRepository,
  ) {}

  async execute(projectId: string, employeeId: string): Promise<void> {
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }

    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) {
      throw new AppError("Employee not found", StatusCodes.NOT_FOUND);
    }

    const isAlreadyInProject = project.teamMemberIds?.includes(employeeId);
    if (isAlreadyInProject) {
      throw new AppError(
        "Employee is already part of the project",
        StatusCodes.BAD_REQUEST,
      );
    }

    project.teamMemberIds = project.teamMemberIds
      ? [...project.teamMemberIds, employeeId]
      : [employeeId];

    await this._projectRepo.update(project);
  }
}
