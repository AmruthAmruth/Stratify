import { IBacklogRepository } from "../../../domain/repositories/IBacklogRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { BacklogDTO, ProjectDetailsDTO, TaskDTO, UserStoryDTO, SprintDTO } from "../../dto/project/GetProjectDetailsDTO";
import { IGetProjectDetailsUseCase } from "../../interfaces/project/IGetProjectDetailsUseCase";

export class GetProjectDetailsUseCase implements IGetProjectDetailsUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _backlogsRepo: IBacklogRepository,
    private _userStoryRepo: IUserStoryRepository,
    private _taskRepo: ITaskRepository,
    private _sprintRepo: ISprintRepository
  ) {}

  async execute(projectId: string): Promise<ProjectDetailsDTO> {
    
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError(`Project with ID ${projectId} not found`);
    }

   
    const backlogs = await this._backlogsRepo.findByProjectId(projectId);

    const backlogDTOs: BacklogDTO[] = [];

    for (const backlog of backlogs) {
      const userStories = await this._userStoryRepo.findByBacklogId(backlog.id!);

      const employeeIds = new Set<string>();
      const userStoryDTOs: UserStoryDTO[] = [];

      for (const story of userStories) {
        const tasks = await this._taskRepo.findByUserStoryId(story.id!);

        const taskDTOs: TaskDTO[] = tasks.map((task) => ({
          taskId:task.id,
          name: task.title,
          description: task.description || "",
          status:
            task.status === "To Do"
              ? "Planned"
              : task.status === "In Progress"
              ? "InProgress"
              : "Completed",
        }));

        story.assignedToIds?.forEach((id) => employeeIds.add(id));

        userStoryDTOs.push({
          userStoryId:story.id,
          name: story.title,
          description: story.description,
          priority: story.priority,
          status:
            story.status === "Backlog"
              ? "Planned"
              : story.status === "To Do"
              ? "Planned"
              : story.status === "In Progress"
              ? "InProgress"
              : "Completed",
          storyPoints: story.storyPoints,
          assignedTo: story.assignedToIds ? story.assignedToIds.join(", ") : "",
          tasks: taskDTOs,
        });
      }

      backlogDTOs.push({
        backlogId:backlog.id,
        name: backlog.name,
        description: backlog.description,
        numberOfEmployees: employeeIds.size,
        userStories: userStoryDTOs,
      });
    }

 
    const sprints = await this._sprintRepo.findByProject(projectId);

    const sprintDTOs: SprintDTO[] = [];
    for (const sprint of sprints) {
    

      const sprintUserStories = await this._userStoryRepo.findByIds(sprint.userStoryIds!);

      
      const sprintUserStoryDTOs: UserStoryDTO[] = [];
      for (const story of sprintUserStories) {
        const tasks = await this._taskRepo.findByUserStoryId(story.id!);


        const taskDTOs: TaskDTO[] = tasks.map((task) => ({
          name: task.title,
          description: task.description || "",
          status:
            task.status === "To Do"
              ? "Planned"
              : task.status === "In Progress"
              ? "InProgress"
              : "Completed",
        }));

        sprintUserStoryDTOs.push({
          userStoryId:story.id,
          name: story.title,
          description: story.description,
          priority: story.priority,
          status:
            story.status === "Backlog"
              ? "Planned"
              : story.status === "To Do"
              ? "Planned"
              : story.status === "In Progress"
              ? "InProgress"
              : "Completed",
          storyPoints: story.storyPoints,
          assignedTo: story.assignedToIds ? story.assignedToIds.join(", ") : "",
          tasks: taskDTOs,
        });
      }

      sprintDTOs.push({
        sprintId:sprint.id,
        name: sprint.name,
        description: sprint.description,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        teamCapacity: sprint.teamCapacity, 
        totalStoryPoints:sprint.totalStoryPoints,
        status: sprint.status,
        userStories: sprintUserStoryDTOs,
      });
    }

   
    const endDate = new Date(project.endDate);
    const now = new Date();
    const remainingDays = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

  
    const dto: ProjectDetailsDTO = {
      name: project.name,
      key: project.key,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      projectLead: project.projectLeadId, 
      totalTeamMembers: project.teamMemberIds ? project.teamMemberIds.length : 0,
      remainingDays,
      backlogs: backlogDTOs,
      sprints: sprintDTOs,
    };

    return dto;
  }
}
