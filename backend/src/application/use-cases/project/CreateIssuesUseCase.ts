import { Issue } from "../../../domain/entities/Issue";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateIssuesDTO } from "../../dto/project/CreateIssuesDTO";
import { ICreateIssueUseCase } from "../../interfaces/project/ICreateIssueUseCase";

export class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _issueRepo: IIssueRepository
  ) {}

  async execute(issueDTO: CreateIssuesDTO): Promise<Issue> {
    const project = await this._projectRepo.findById(issueDTO.projectId);
    if (!project) throw new AppError("Project Not Found", 404);

    const existingIssues = await this._issueRepo.findAllByProject(
      issueDTO.projectId
    );
    const duplicate = existingIssues.find(
      (i) =>
        i.heading.toLowerCase().trim() === issueDTO.heading.toLowerCase().trim()
    );
    if (duplicate)
      throw new AppError(
        "Issue with this heading already exists in the project",
        400
      );

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
      issueDTO.assignedTo || null
    );

    const createdIssue = await this._issueRepo.create(issue);

    return createdIssue;
  }
}
