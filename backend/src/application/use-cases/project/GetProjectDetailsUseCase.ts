import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";

import {
  ProjectDetailsDTO,
} from "../../dto/project/GetProjectDetailsDTO";
import { IGetProjectDetailsUseCase } from "../../interfaces/project/IGetProjectDetailsUseCase";
import { ProjectDetailsMapper } from "../../mappers/ProjectDetailsMapper";

export class GetProjectDetailsUseCase implements IGetProjectDetailsUseCase {
  constructor(
    private projectRepo: IProjectRepository,
    private issueRepo: IIssueRepository,
    private subTaskRepo: ISubtaskRepository,
    private sprintRepo: ISprintRepository,
  ) {}

  async execute(projectId: string): Promise<ProjectDetailsDTO> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }

    const issues = await this.issueRepo.findByProjectId(projectId);
    const sprints = await this.sprintRepo.findByProjectId(projectId);

    const mappedIssues = await this.mapIssues(issues);
    const backlogIssues = mappedIssues.filter((i) => !i.sprintId);

    const { active, planned, completed } =
      ProjectDetailsMapper.categorizeSprints(sprints, mappedIssues);

    return {
      id: project.id!,
      name: project.name,
      key: project.key,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      departmentId: project.departmentId,
      projectLeadId: project.projectLeadId,
      companyId: project.companyId,

      backlog: backlogIssues,
      activeSprints: active,
      plannedSprints: planned,
      completedSprints: completed,

      activeSprintCount: active.length,
      plannedSprintCount: planned.length,
      completedSprintCount: completed.length,
    };
  }

  private async mapIssues(issues: any[]) {
    return Promise.all(
      issues.map(async (issue) => {
        const subtasks = await this.subTaskRepo.findAllByIssue(issue.id!);
        return ProjectDetailsMapper.mapIssue(issue, subtasks);
      })
    );
  }
}
