import { Sprint } from "../../../domain/entities/Sprint";
import { CreateSprintDTO } from "../../dto/project/CreateSprintDTO";


export interface ICreateSprintUseCase{
    execute(sprintDTO:CreateSprintDTO):Promise<Sprint>
}