import { SubTask } from "../../../domain/entities/SubTask";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateSubTaskDTO } from "../../dto/project/CreateSubTaskDTO";
import { ICreateSubTaskUseCase } from "../../interfaces/project/ICreateSubTaskUseCase";

export class CreateSubTaskUseCase implements ICreateSubTaskUseCase {
  constructor(
    private _issueRepo: IIssueRepository,
    private _subTaskRepo: ISubtaskRepository,
  ) {}

  async execute(subtaskDTO: CreateSubTaskDTO): Promise<SubTask> {
    const issue = this._issueRepo.findById(subtaskDTO.issueId);
    if (!issue) throw new AppError("Issue not found", 404);

    const existingSubTasks = await this._subTaskRepo.findAllByIssue(
      subtaskDTO.issueId,
    );
    const isDuplicate = existingSubTasks.some(
      (s) => s.heading.toLowerCase() === subtaskDTO.heading.toLowerCase(),
    );
    if (isDuplicate)
      throw new AppError("Subtask with the same heading already exists", 400);

    const subtask = new SubTask(
      undefined,
      subtaskDTO.issueId,
      subtaskDTO.heading,
      subtaskDTO.description,
      subtaskDTO.hours,
      subtaskDTO.status || "To Do",
      subtaskDTO.assignedToId || null,
    );

    const createdSubTask = await this._subTaskRepo.create(subtask);

    return createdSubTask;
  }
}
