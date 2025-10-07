import { Issue } from "../../../domain/entities/Issue";
import { IssueRepository } from "../../../infrastructure/repositories/IssueRepository";
import { SprintRepository } from "../../../infrastructure/repositories/SprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IAssignIssueToSprintUseCase } from "../../interfaces/project/IAssignIssueToSprintUseCase";

export class AssignIssueToSprintUseCase implements IAssignIssueToSprintUseCase {
  private readonly WEEKLY_LIMIT = 40;
  constructor(
    private _issueRepo: IssueRepository,
    private _sprintRepo: SprintRepository
  ) {}
  async execute(issueId: string, sprintId: string): Promise<Issue> {
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) throw new AppError("Issue not found", StatusCodes.NOT_FOUND);

    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) throw new AppError("Sprint not found", StatusCodes.NOT_FOUND);

    if (!issue.assignedTo) {
      throw new AppError(
        "Issue must have an assigned employee before moving to a sprint",
        StatusCodes.BAD_REQUEST
      );
    }

    const sprintIssues = await this._issueRepo.findBySprintId(sprintId);

    const totalAllocatedHours = sprintIssues
      .filter((i) => i.assignedTo === issue.assignedTo)
      .reduce((sum, i) => sum + i.estimatedHours, 0);

    if (totalAllocatedHours + issue.estimatedHours > this.WEEKLY_LIMIT) {
      const available = this.WEEKLY_LIMIT - totalAllocatedHours;
      throw new AppError(
        `Employee capacity exceeded. Only ${available}h available in this sprint.`,
        400
      );
    }

    issue.moveToSprint(sprintId);

    const updatedIssue = await this._issueRepo.update(issue);
    return updatedIssue;
  }
}
