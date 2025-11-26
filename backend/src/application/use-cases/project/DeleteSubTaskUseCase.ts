import { ISubtaskRepository } from "../../../domain/repositories/ISubTaskRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IDeleteSubTaskUseCase } from "../../interfaces/project/IDeleteSubTaskUseCase";

export class DeleteSubTaskUseCase implements IDeleteSubTaskUseCase {
    constructor(private _subTaskRepo: ISubtaskRepository) { }

    async execute(subtaskId: string): Promise<void> {
        const subtask = await this._subTaskRepo.findById(subtaskId);
        if (!subtask) {
            throw new AppError("Subtask not found", StatusCodes.NOT_FOUND);
        }

        await this._subTaskRepo.delete(subtaskId);
    }
}
