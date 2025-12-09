import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { IDeleteSprintUseCase } from "../../interfaces/project/IDeleteSprintUseCase";

export class DeleteSprintUseCase implements IDeleteSprintUseCase {
    constructor(private _sprintRepo: ISprintRepository) { }

    async execute(sprintId: string): Promise<void> {
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this._sprintRepo.delete(sprintId);
    }
}
