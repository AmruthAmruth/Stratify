import { IBacklogRepository } from "../../../domain/repositories/IBacklogRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { BacklogDTO, GetProjectDetailsDTO, TaskDTO, UserStoryDTO } from "../../dto/project/GetProjectDetailsDTO";
import { IGetProjectDetailsUseCase } from "../../interfaces/project/IGetProjectDetailsUseCase";



export class GetProjectDetailsUseCase implements IGetProjectDetailsUseCase{
    
constructor(
  private _projectRepo:IProjectRepository,
  private _backlogsRepo:IBacklogRepository,
  private _userStoryRepo:IUserStoryRepository,
  private _taskRepo:ITaskRepository,
){}

async execute(projectId:string):Promise<GetProjectDetailsDTO>{
 const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new AppError(`Project with ID ${projectId} not found`);
    }


    const backlogsData = await this._backlogsRepo.findByProjectId(projectId);

    const backlogs: BacklogDTO[] = [];

    let totalStoryPoints = 0;
    let totalTasks = 0;

    for (const backlog of backlogsData) {
         const userStoriesData = await this._userStoryRepo.findByBacklogId(backlog.id!);
           const userStories: UserStoryDTO[] = [];

             for (const story of userStoriesData){
                 const tasksData = await this._taskRepo.findByUserStoryId(story.id!);

         const tasks: TaskDTO[] = tasksData.map((t) => ({
          name: t.title,
          description: t.description,
          status: t.status,
        }));


         totalTasks += tasks.length;
        totalStoryPoints += story.storyPoints;


        userStories.push({
          name: story.title,
          description: story.description,
          priority: story.priority,
          status: story.status,
          storyPoints: story.storyPoints,
          assignedTo: story.assignedToIds,
          tasks,
        });



             }

             

    }







}
}