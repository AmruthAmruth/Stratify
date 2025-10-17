import { Task } from "../../../domain/entities/Task";
import { CreateTaskDTO } from "../../dto/project/CreateTaskDTO";

export interface ICreateTaskUseCase {
  execute(taskDTO: CreateTaskDTO): Promise<Task>;
}
