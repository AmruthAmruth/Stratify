import { SubTask } from "../../../domain/entities/SubTask";
import { UpdateSubTaskDTO } from "../../dto/project/UpdateSubTaskDTO";

export interface IUpdateSubTaskUseCase {
    execute(subtaskDTO: UpdateSubTaskDTO): Promise<SubTask>;
}
