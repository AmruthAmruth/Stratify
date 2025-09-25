import { Task } from "../../../domain/entities/Task";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateTaskDTO } from "../../dto/project/CreateTaskDTO";
import { ICreateTaskUseCase } from "../../interfaces/project/ICreateTaskUseCase";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private readonly _taskRepo: ITaskRepository,
    private readonly _userStoryRepo: IUserStoryRepository,
    private readonly _employeeRepo: IEmployeeRepository
  ) {}

  async execute(taskDTO: CreateTaskDTO): Promise<Task> {
  
    const userStory = await this._userStoryRepo.findById(taskDTO.userStoryId);
    if (!userStory) throw new AppError("UserStory not found", 404);

    
 if (taskDTO.assignedToId) {
      const employee = await this._employeeRepo.findById(taskDTO.assignedToId);
      if (!employee) {
        throw new AppError(`Assigned user with ID ${taskDTO.assignedToId} does not exist`, 404);
      }

      if (employee.companyId !== userStory.projectId) { 
        throw new AppError(`Assigned user does not belong to the same company as the user story`, 400);
      }
    }

    
    

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
