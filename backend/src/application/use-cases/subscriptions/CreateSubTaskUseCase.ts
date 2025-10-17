import { SubTask } from "../../../domain/entities/SubTask";
import { IssueRepository } from "../../../infrastructure/repositories/IssueRepository";
import { SubTaskRepository } from "../../../infrastructure/repositories/SubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateSubTaskDTO } from "../../dto/project/CreateSubTaskDTO";
import { ICreateSubTaskUseCase } from "../../interfaces/project/ICreateSubTaskUseCase";

export class CreateSubTaskUseCase implements ICreateSubTaskUseCase {
  constructor(
    private _subtaskRepo: SubTaskRepository,
    private _issueRepo: IssueRepository,
  ) {}

  async execute(subtaskDTO: CreateSubTaskDTO): Promise<SubTask> {
    const issue = await this._issueRepo.findById(subtaskDTO.issueId);

    if (!issue) {
      throw new AppError("Issue is not found", StatusCodes.NOT_FOUND);
    }

    const subtask = new SubTask(
      undefined,
      subtaskDTO.issueId,
      subtaskDTO.heading,
      subtaskDTO.description,
      subtaskDTO.hours,
      subtaskDTO.status || "To Do",
      subtaskDTO.assignedToId || null,
      new Date(),
      new Date(),
    );

    const createdSubTask = await this._subtaskRepo.create(subtask);

    return createdSubTask;
  }
}
