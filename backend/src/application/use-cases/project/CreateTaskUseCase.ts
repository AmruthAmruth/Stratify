import { Task } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { CreateTaskDTO } from "../../dto/project/CreateTaskDTO";
import { ICreateTaskUseCase } from "../../interfaces/project/ICreateTaskUseCase";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(private readonly _taskRepo: ITaskRepository) {}

  async execute(taskDTO: CreateTaskDTO): Promise<Task> {
  

    const task = new Task(
      undefined,                
      taskDTO.userStoryId,
      taskDTO.title,
      taskDTO.description,
      taskDTO.status ?? "To Do",  
      taskDTO.assignedToId,
      new Date(),                 
      new Date()                  
    );

    
    return await this._taskRepo.create(task);
  }
}
