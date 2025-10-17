import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IDeleteProjectUseCase } from "../../interfaces/project/IDeleteProjectUseCase";

export class DeleteProjectUseCase implements IDeleteProjectUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _issueRepo: IIssueRepository,
    private _subTaskRepo: ISubtaskRepository,
    private _sprintRepo: ISprintRepository,
  ) {}

  async execute(projectId: string): Promise<void> {
    console.log("Porject id", projectId);

    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const sprints = await this._sprintRepo.findByProjectId(projectId);

    for (const sprint of sprints) {
      const issues = await this._issueRepo.findBySprintId(sprint.id!);

      for (const issue of issues) {
        await this._subTaskRepo.delete(issue.id!);
      }

      await this._issueRepo.delete(sprint.id!);
    }

    await this._sprintRepo.deleteByProjectId(projectId);
    const backlogIssues = await this._issueRepo.findByProjectId(projectId);
    for (const issue of backlogIssues) {
      await this._subTaskRepo.deleteByIssueId(issue.id!);
    }

    await this._issueRepo.deleteByProjectId(projectId);

    await this._projectRepo.delete(projectId);
  }
}
