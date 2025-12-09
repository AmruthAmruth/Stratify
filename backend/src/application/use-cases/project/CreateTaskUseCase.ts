import { Task } from "../../../domain/entities/Task";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserStoryRepository } from "../../../domain/repositories/IUserStoryRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { CreateTaskDTO } from "../../dto/project/CreateTaskDTO";
import { ICreateTaskUseCase } from "../../interfaces/project/ICreateTaskUseCase";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private readonly _taskRepo: ITaskRepository,
    private readonly _userStoryRepo: IUserStoryRepository,
    private readonly _employeeRepo: IEmployeeRepository,
    private readonly _projectRepo: IProjectRepository,
  ) { }

  async execute(taskDTO: CreateTaskDTO): Promise<Task> {
    const userStory = await this._userStoryRepo.findById(taskDTO.userStoryId);
    if (!userStory)
      throw new AppError(Messages.USER_STORY_NOT_FOUND, StatusCodes.NOT_FOUND);

    if (taskDTO.assignedToId) {
      const employee = await this._employeeRepo.findById(taskDTO.assignedToId);
      if (!employee) {
        throw new AppError(
          Messages.ASSIGNED_USER_NOT_EXIST,
          StatusCodes.NOT_FOUND,
        );
      }

      const project = await this._projectRepo.findById(userStory.projectId);
      if (employee.companyId !== project?.companyId) {
        throw new AppError(
          Messages.ASSIGNED_USER_NOT_IN_COMPANY,
          StatusCodes.NOT_FOUND,
        );
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
      new Date(),
    );

    return await this._taskRepo.create(task);
  }
}
