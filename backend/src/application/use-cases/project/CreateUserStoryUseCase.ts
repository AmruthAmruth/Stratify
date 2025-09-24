import { UserStory } from "../../../domain/entities/UserStory";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { CreateUserStoryDTO } from "../../dto/project/CreateUserStoryDTO";
import { ICreateUserStoryUseCase } from "../../interfaces/project/ICreateUserStoryUseCase";




export class CreateUserStoryUseCase implements ICreateUserStoryUseCase{

    constructor(
            private _userStoryRepo:IUserStoryRepository,
    ){}
    async execute(userStoryDTO: CreateUserStoryDTO): Promise<UserStory> {
       
        const userStory = new UserStory(
      undefined,
      userStoryDTO.title,
      userStoryDTO.description,
      userStoryDTO.projectId,
      userStoryDTO.createdBy,
      userStoryDTO.priority ?? "Medium",
      userStoryDTO.status ?? "To Do",
      userStoryDTO.storyPoints,
      userStoryDTO.capacity,
      userStoryDTO.assignedTo,
      new Date(),
      new Date()
    );


    const created = await this._userStoryRepo.create(userStory);

    return created;

    }
}