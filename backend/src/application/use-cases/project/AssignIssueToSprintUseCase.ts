import { Issue } from "../../../domain/entities/Issue";
import { IssueRepository } from "../../../infrastructure/repositories/IssueRepository";
import { SprintRepository } from "../../../infrastructure/repositories/SprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IAssignIssueToSprintUseCase } from "../../interfaces/project/IAssignIssueToSprintUseCase";

export class AssignIssueToSprintUseCase implements IAssignIssueToSprintUseCase {
  constructor(
    private _issueRepo: IssueRepository,
    private _sprintRepo: SprintRepository
  ) {}
  async execute(issueId: string, sprintId: string): Promise<Issue> {
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) throw new AppError("Issue not found", 404);

    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) throw new AppError("Sprint not found", 404);
    issue.moveToSprint(sprintId);

    const updatedIssue = await this._issueRepo.update(issue);
    return updatedIssue;
  }
}
