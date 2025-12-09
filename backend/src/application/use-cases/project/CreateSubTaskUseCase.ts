import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { CreateSubTaskDTO } from "../../dto/project/CreateSubTaskDTO";
import { ICreateSubTaskUseCase } from "../../interfaces/project/ICreateSubTaskUseCase";
import { SubTaskMapper } from "../../mappers/SubTaskMapper";
import { SubTask } from "../../../domain/entities/SubTask";

export class CreateSubTaskUseCase implements ICreateSubTaskUseCase {
  constructor(
    private _issueRepo: IIssueRepository,
    private _subTaskRepo: ISubtaskRepository,
  ) { }

  async execute(
    subtaskDTO: CreateSubTaskDTO,
    userId?: string,
    userRole?: string
  ): Promise<SubTask> {
    const issue = await this._issueRepo.findById(subtaskDTO.issueId);
    if (!issue) throw new AppError(Messages.ISSUE_NOT_FOUND, StatusCodes.NOT_FOUND);

    if (userRole === "employee" && issue.assignedTo !== userId) {
      throw new AppError(
        Messages.SUBTASK_CREATION_RESTRICTED,
        StatusCodes.FORBIDDEN
      );
    }

    const existingSubTasks = await this._subTaskRepo.findAllByIssue(
      subtaskDTO.issueId,
    );
    const isDuplicate = existingSubTasks.some(
      (s) => s.heading.toLowerCase() === subtaskDTO.heading.toLowerCase(),
    );
    if (isDuplicate)
      throw new AppError(Messages.SUBTASK_HEADING_EXISTS, StatusCodes.BAD_REQUEST);

    const subtask = SubTaskMapper.toDomain(subtaskDTO);

    const createdSubTask = await this._subTaskRepo.create(subtask);

    return createdSubTask;
  }
}
