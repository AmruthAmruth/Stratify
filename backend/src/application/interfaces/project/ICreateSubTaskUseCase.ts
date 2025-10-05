import { SubTask } from "../../../domain/entities/SubTask";
import { CreateSubTaskDTO } from "../../dto/project/CreateSubTaskDTO";

export interface ICreateSubTaskUseCase{
    execute(subtaskDTO:CreateSubTaskDTO):Promise<SubTask>
}