import { Issue } from "../../../domain/entities/Issue";
import { IssueRepository } from "../../../infrastructure/repositories/IssueRepository";
import { SprintRepository } from "../../../infrastructure/repositories/SprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IAssignIssueToSprintUseCase } from "../../interfaces/project/IAssignIssueToSprintUseCase";
import { IValidateEmployeeCapacityUseCase } from "../../interfaces/project/IValidateEmployeeCapacityUseCase";

export class AssignIssueToSprintUseCase implements IAssignIssueToSprintUseCase {
  constructor(
    private _issueRepo: IssueRepository,
    private _sprintRepo: SprintRepository,
    private _validateCapacityUseCase: IValidateEmployeeCapacityUseCase
  ) { }
  async execute(issueId: string, sprintId: string): Promise<Issue> {
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) throw new AppError(Messages.ISSUE_NOT_FOUND, StatusCodes.NOT_FOUND);

    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);

    
    if (issue.assignedTo) {
      const validationResult = await this._validateCapacityUseCase.execute({
        employeeId: issue.assignedTo,
        sprintId: sprintId,
        additionalSize: issue.size,
        excludeIssueId: issue.id,
      });

      if (!validationResult.isValid) {
        throw new AppError(
          validationResult.errorMessage || Messages.EMPLOYEE_CAPACITY_EXCEEDED,
          StatusCodes.BAD_REQUEST
        );
      }
    }

    
    
    issue.sprintId = sprintId;

    const updatedIssue = await this._issueRepo.update(issue);
    return updatedIssue;
  }
}
