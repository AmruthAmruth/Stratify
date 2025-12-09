import { Issue } from "../../../domain/entities/Issue";
import { IssueRepository } from "../../../infrastructure/repositories/IssueRepository";
import { SprintRepository } from "../../../infrastructure/repositories/SprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IAssignIssueToSprintUseCase } from "../../interfaces/project/IAssignIssueToSprintUseCase";

export class AssignIssueToSprintUseCase implements IAssignIssueToSprintUseCase {
  constructor(
    private _issueRepo: IssueRepository,
    private _sprintRepo: SprintRepository,
  ) { }
  async execute(issueId: string, sprintId: string): Promise<Issue> {
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) throw new AppError(Messages.ISSUE_NOT_FOUND, StatusCodes.NOT_FOUND);

    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);

    if (!issue.assignedTo) {
      throw new AppError(
        Messages.ISSUE_NO_ASSIGNEE,
        StatusCodes.BAD_REQUEST,
      );
    }

    // Assign issue to sprint
    issue.sprintId = sprintId;

    const updatedIssue = await this._issueRepo.update(issue);
    return updatedIssue;
  }
}
