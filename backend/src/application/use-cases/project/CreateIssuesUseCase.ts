import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";
import { ICreateIssueUseCase } from "../../interfaces/project/ICreateIssueUseCase";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";

export class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _issueRepo: IIssueRepository,
    private _employeeRepo: IEmployeeRepository,
    private _notificationRepo: INotificationRepository
  ) { }

  async execute(issueDTO: CreateIssuesDTO): Promise<Issue> {
    const project = await this._projectRepo.findById(issueDTO.projectId);
    if (!project)
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);

    const existingIssues = await this._issueRepo.findAllByProject(
      issueDTO.projectId,
    );
    const duplicate = existingIssues.find(
      (i) =>
        i.heading.toLowerCase().trim() ===
        issueDTO.heading.toLowerCase().trim(),
    );
    if (duplicate)
      throw new AppError(
        "Issue with this heading already exists in the project",
        StatusCodes.BAD_REQUEST,
      );

    if (issueDTO.assignedTo) {
      const employee = await this._employeeRepo.findById(issueDTO.assignedTo);
      if (!employee)
        throw new AppError(
          "Assigned employee not found",
          StatusCodes.NOT_FOUND,
        );

      if (!project.teamMemberIds?.includes(employee.id!)) {
        throw new AppError(
          "Employee is not part of this project",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    const issue = new Issue(
      undefined,
      issueDTO.heading,
      issueDTO.description,
      issueDTO.acceptanceCriteria,
      issueDTO.size,
      issueDTO.estimatedHours,
      issueDTO.type,
      "Planned",
      issueDTO.priority,
      issueDTO.projectId,
      null,
      issueDTO.assignedTo || null,
    );

    const createdIssue = await this._issueRepo.create(issue);

    // Notify employee if task is assigned
    if (issueDTO.assignedTo) {
      const employee = await this._employeeRepo.findById(issueDTO.assignedTo);
      if (employee) {
        const notification = new Notification(
          employee.id!,
          employee.role,
          "New Task Assigned",
          `📌 You have been assigned a new task: "${issueDTO.heading}" in project ${project.name}`,
          "info"
        );
        NotificationEmitter.emit(notification);
        await this._notificationRepo.create(notification);
      }
    }

    return createdIssue;
  }
}
