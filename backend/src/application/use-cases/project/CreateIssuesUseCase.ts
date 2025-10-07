
import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";
import { ICreateIssueUseCase } from "../../interfaces/project/ICreateIssueUseCase";
import { StatusCodes } from "../../../shared/constants/statusCodes";

export class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _issueRepo: IIssueRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(issueDTO: CreateIssuesDTO): Promise<Issue> {
   
    const project = await this._projectRepo.findById(issueDTO.projectId);
    if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);

    const existingIssues = await this._issueRepo.findAllByProject(issueDTO.projectId);
    const duplicate = existingIssues.find(
      (i) => i.heading.toLowerCase().trim() === issueDTO.heading.toLowerCase().trim()
    );
    if (duplicate)
      throw new AppError(
        "Issue with this heading already exists in the project",
        StatusCodes.BAD_REQUEST
      );

    if (issueDTO.assignedTo) {
      const employee = await this._employeeRepo.findById(issueDTO.assignedTo);
      if (!employee)
        throw new AppError("Assigned employee not found", StatusCodes.NOT_FOUND);

      if (!project.teamMemberIds?.includes(employee.id!)) {
        throw new AppError(
          "Employee is not part of this project",
          StatusCodes.BAD_REQUEST
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
      issueDTO.assignedTo || null
    );

    const createdIssue = await this._issueRepo.create(issue);

    return createdIssue;
  }
}
