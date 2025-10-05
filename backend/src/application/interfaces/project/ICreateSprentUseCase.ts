import { Sprint } from "../../../domain/entities/Sprent";
import { CreateSprintDTO } from "../../dto/project/CreateSprentDTO";


export interface ICreateSprentUseCase {
    execute(sprintDTO:CreateSprintDTO):Promise<Sprint>
}