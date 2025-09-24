import { UserStory } from "../../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { CreateUserStoryDTO } from "../../dto/project/CreateUserStoryDTO";
import { ICreateUserStoryUseCase } from "../../interfaces/project/ICreateUserStoryUseCase";

export class CreateUserStoryUseCase implements ICreateUserStoryUseCase {
  constructor(private _userStoryRepo: IUserStoryRepository) {}

  async execute(userStoryDTO: CreateUserStoryDTO): Promise<UserStory> {
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
