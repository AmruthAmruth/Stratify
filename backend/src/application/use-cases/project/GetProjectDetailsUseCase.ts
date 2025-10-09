import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { ProjectDetailsDTO, SprintWithIssuesDTO } from "../../dto/project/GetProjectDetailsDTO";
import { IGetProjectDetailsUseCase } from "../../interfaces/project/IGetProjectDetailsUseCase";




export class GetProjectDetailsUseCase implements IGetProjectDetailsUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _issueRepo: IIssueRepository,
    private _subTaskRepo: ISubtaskRepository,
    private _sprintRepo: ISprintRepository
  ) {}

  async execute(projectId: string): Promise<ProjectDetailsDTO> {
    
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }

    const issues = await this._issueRepo.findByProjectId(projectId);
    const sprints = await this._sprintRepo.findByProjectId(projectId);

    
    const issuesWithSubtasks = await Promise.all(
      issues.map(async (issue) => {
        const issueSubtasks = await this._subTaskRepo.findAllByIssue(issue.id!);
        return {
          id: issue.id!,
          heading: issue.heading,
          description: issue.description,
          acceptanceCriteria: issue.acceptanceCriteria,
          size: issue.size,
          estimatedHours: issue.estimatedHours,
          type: issue.type,
          status: issue.status,
          priority: issue.priority,
          assignedTo: issue.assignedTo ?? null,
          sprintId: issue.sprintId ?? null,
          subTasks: issueSubtasks.map((st) => ({
            id: st.id!,
            heading: st.heading,
            description: st.description,
            hours: st.hours,
            status: st.status,
            assignedToId: st.assignedToId ?? null,
          })),
        };
      })
    );

    
    const backlogIssues = issuesWithSubtasks.filter((i) => !i.sprintId);

    const activeSprints: SprintWithIssuesDTO[] = [];
    const plannedSprints: SprintWithIssuesDTO[] = [];
    const completedSprints: SprintWithIssuesDTO[] = [];

    sprints.forEach((sprint) => {
      const sprintIssues = issuesWithSubtasks.filter((i) => i.sprintId === sprint.id);
      const sprintDTO: SprintWithIssuesDTO = {
        id: sprint.id!,
        name: sprint.name,
        goal: sprint.goal,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        issues: sprintIssues,
      };

      if (sprint.status === "Active") activeSprints.push(sprintDTO);
      else if (sprint.status === "Planned") plannedSprints.push(sprintDTO);
      else if (sprint.status === "Completed") completedSprints.push(sprintDTO);
    });

    
    const projectDetails: ProjectDetailsDTO = {
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
      activeSprints,
      plannedSprints,
      completedSprints,
      activeSprintCount: activeSprints.length,
      plannedSprintCount: plannedSprints.length,
      completedSprintCount: completedSprints.length,
    };

    return projectDetails;
  }
}
