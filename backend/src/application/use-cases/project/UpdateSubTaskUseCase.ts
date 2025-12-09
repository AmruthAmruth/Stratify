import { SubTask } from "../../../domain/entities/SubTask";
import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { UpdateSubTaskDTO } from "../../dto/project/UpdateSubTaskDTO";
import { IUpdateSubTaskUseCase } from "../../interfaces/project/IUpdateSubTaskUseCase";

export class UpdateSubTaskUseCase implements IUpdateSubTaskUseCase {
    constructor(private _subTaskRepo: ISubtaskRepository) { }

    async execute(subtaskDTO: UpdateSubTaskDTO): Promise<SubTask> {
        const existingSubTask = await this._subTaskRepo.findById(subtaskDTO.id);
        if (!existingSubTask) {
            throw new AppError(Messages.SUBTASK_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updatedSubTask = new SubTask(
            existingSubTask.id,
            existingSubTask.issueId,
            subtaskDTO.heading,
            subtaskDTO.description,
            subtaskDTO.hours,
            subtaskDTO.status || existingSubTask.status,
            subtaskDTO.assignedToId || existingSubTask.assignedToId
        );

        return await this._subTaskRepo.update(updatedSubTask);
    }
}
