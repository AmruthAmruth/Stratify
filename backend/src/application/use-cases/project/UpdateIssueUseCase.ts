import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { UpdateIssueDTO } from "../../dto/project/CreateIssuesDTO";
import { IUpdateIssueUseCase } from "../../interfaces/project/IUpdateIssueUseCase";
import { IValidateEmployeeCapacityUseCase } from "../../interfaces/project/IValidateEmployeeCapacityUseCase";

export class UpdateIssueUseCase implements IUpdateIssueUseCase {
  constructor(
    private _issueRepo: IIssueRepository,
    private _employeeRepo: IEmployeeRepository,
    private _projectRepo: IProjectRepository,
    private _validateCapacityUseCase: IValidateEmployeeCapacityUseCase
  ) { }

  async execute(issueDTO: UpdateIssueDTO): Promise<Issue> {


    const existingIssue = await this._issueRepo.findById(issueDTO.id);
    if (!existingIssue) {
      throw new AppError(Messages.ISSUE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Validate employee capacity if assigning to a new employee in a sprint
    if (issueDTO.assignedTo !== undefined && existingIssue.sprintId) {
      const isChangingAssignment = issueDTO.assignedTo !== existingIssue.assignedTo;

      if (isChangingAssignment && issueDTO.assignedTo) {
        // Validate that the new employee exists
        const employee = await this._employeeRepo.findById(issueDTO.assignedTo);
        if (!employee) {
          throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        // Validate that employee is in the project
        const project = await this._projectRepo.findById(existingIssue.projectId);
        if (project && !project.teamMemberIds?.includes(issueDTO.assignedTo)) {
          throw new AppError(Messages.EMPLOYEE_NOT_IN_PROJECT, StatusCodes.BAD_REQUEST);
        }

        // Validate capacity
        const validationResult = await this._validateCapacityUseCase.execute({
          employeeId: issueDTO.assignedTo,
          sprintId: existingIssue.sprintId,
          additionalSize: issueDTO.size ?? existingIssue.size,
          excludeIssueId: existingIssue.id,
        });

        if (!validationResult.isValid) {
          throw new AppError(
            validationResult.errorMessage || Messages.EMPLOYEE_CAPACITY_EXCEEDED,
            StatusCodes.BAD_REQUEST
          );
        }
      }
    }


    const updatedIssue = new Issue(
      existingIssue.id,
      issueDTO.heading ?? existingIssue.heading,
      issueDTO.description ?? existingIssue.description,
      issueDTO.acceptanceCriteria ?? existingIssue.acceptanceCriteria,
      issueDTO.size ?? existingIssue.size,
      issueDTO.type ?? existingIssue.type,
      existingIssue.status,
      issueDTO.priority ?? existingIssue.priority,
      existingIssue.projectId,
      existingIssue.sprintId,
      issueDTO.assignedTo !== undefined ? issueDTO.assignedTo : existingIssue.assignedTo,
      existingIssue.createdAt,
      new Date(),
    );

    const savedIssue = await this._issueRepo.update(updatedIssue);



    return savedIssue;
  }
}
