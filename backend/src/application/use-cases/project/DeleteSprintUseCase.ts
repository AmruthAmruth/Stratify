import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IDeleteSprintUseCase } from "../../interfaces/project/IDeleteSprintUseCase";

export class DeleteSprintUseCase implements IDeleteSprintUseCase {
    constructor(private _sprintRepo: ISprintRepository) { }

    async execute(sprintId: string): Promise<void> {
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError("Sprint not found", StatusCodes.NOT_FOUND);
        }

        await this._sprintRepo.delete(sprintId);
    }
}
