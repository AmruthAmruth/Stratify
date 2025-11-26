import { Sprint } from "../../../domain/entities/Sprint";
import { UpdateSprintDTO } from "../../dto/project/UpdateSprintDTO";

export interface IUpdateSprintUseCase {
    execute(sprintDTO: UpdateSprintDTO): Promise<Sprint>;
}
