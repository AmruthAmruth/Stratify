import { Sprint } from "../../../domain/entities/Sprint";
import { AssignUserStoryToSprintDTO } from "../../dto/project/AssignUserStoryToSprintDTO";


export interface IAssignUserStoryToSprintUseCase {
  execute(dto: AssignUserStoryToSprintDTO): Promise<Sprint>;
}