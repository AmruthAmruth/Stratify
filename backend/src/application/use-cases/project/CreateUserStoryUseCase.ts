import { UserStory } from "../../../domain/entities/UserStory";
import { IBacklogRepository } from "../../../domain/repositories/IBacklogRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { validateEmployees } from "../../../shared/utils/EmployeeValidator";
import { CreateUserStoryDTO } from "../../dto/project/CreateUserStoryDTO";
import { ICreateUserStoryUseCase } from "../../interfaces/project/ICreateUserStoryUseCase";

export class CreateUserStoryUseCase implements ICreateUserStoryUseCase {
  constructor(
    private _userStoryRepo: IUserStoryRepository,
    private _backlogRepo: IBacklogRepository,
    private _projectRepo: IProjectRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(userStoryDTO: CreateUserStoryDTO): Promise<UserStory> {

const backlog = await this._backlogRepo.findById(userStoryDTO.backlogId);
    if (!backlog) throw new AppError("Backlog not found", 404);

    if (backlog.projectId !== userStoryDTO.projectId) {
      throw new AppError("Backlog does not belong to the given project", 400);
    }



       const project = await this._projectRepo.findById(userStoryDTO.projectId);
    if (!project) throw new AppError("Project not found", 404);

 await validateEmployees(this._employeeRepo, userStoryDTO.assignedToIds, project.companyId, "Assigned user");




    const userStory = new UserStory(
      undefined,                          
      userStoryDTO.title,                  
      userStoryDTO.description,            
      userStoryDTO.projectId,              
      userStoryDTO.backlogId,              
      userStoryDTO.createdBy,              
      userStoryDTO.priority ?? "Medium",   
      userStoryDTO.status ?? "Backlog",   
      userStoryDTO.storyPoints,            
      undefined,                           
      userStoryDTO.assignedToIds,         
      userStoryDTO.acceptanceCriteria,     
      new Date(),                          
      new Date()                           
    );

    return await this._userStoryRepo.create(userStory);
  }
}
