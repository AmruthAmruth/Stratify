import { Sprint } from "../../../domain/entities/Sprint";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { UpdateSprintDTO } from "../../dto/project/UpdateSprintDTO";
import { IUpdateSprintUseCase } from "../../interfaces/project/IUpdateSprintUseCase";

export class UpdateSprintUseCase implements IUpdateSprintUseCase {
    constructor(private _sprintRepo: ISprintRepository) { }

    async execute(sprintDTO: UpdateSprintDTO): Promise<Sprint> {
        const existingSprint = await this._sprintRepo.findById(sprintDTO.id);
        if (!existingSprint) {
            throw new AppError(Messages.SPRINT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updatedSprint = new Sprint(
            existingSprint.id,
            sprintDTO.name,
            sprintDTO.goal,
            new Date(sprintDTO.startDate),
            new Date(sprintDTO.endDate),
            existingSprint.projectId,
            existingSprint.status,
            existingSprint.createdAt,
            new Date()
        );

        return await this._sprintRepo.update(updatedSprint);
    }
}
