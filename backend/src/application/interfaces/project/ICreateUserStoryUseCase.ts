import { UserStory } from "../../../domain/entities/UserStory";
import { CreateUserStoryDTO } from "../../dto/project/CreateUserStoryDTO";

export interface ICreateUserStoryUseCase {
  execute(userStoryDTO: CreateUserStoryDTO): Promise<UserStory>;
}
