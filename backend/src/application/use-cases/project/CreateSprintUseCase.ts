import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { CreateSprintDTO } from "../../dto/project/CreateSprintDTO";
import { ICreateSprintUseCase } from "../../interfaces/project/ICreateSprintUseCase";
import { SprintMapper } from "../../mappers/SprintMapper";
import { Sprint } from "../../../domain/entities/Sprint";

export class CreateSprintUseCase implements ICreateSprintUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _sprintRepo: ISprintRepository,
  ) { }

  async execute(sprintDTO: CreateSprintDTO): Promise<Sprint> {
    const project = await this._projectRepo.findById(sprintDTO.projectId);
    if (!project) {
      throw new AppError(Messages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const sprintStart = new Date(sprintDTO.startDate);
    const sprintEnd = new Date(sprintDTO.endDate);

    if (sprintStart < projectStart || sprintEnd > projectEnd) {
      throw new AppError(
        Messages.SPRINT_DURATION_INVALID,
        StatusCodes.BAD_REQUEST,
      );
    }

    if (sprintStart > sprintEnd) {
      throw new AppError(
        Messages.SPRINT_START_AFTER_END,
        StatusCodes.BAD_REQUEST,
      );
    }

    const overlappingSprint = await this._sprintRepo.findOverlappingSprint(
      sprintDTO.projectId,
      sprintDTO.startDate,
      sprintDTO.endDate,
    );

    if (overlappingSprint) {
      throw new AppError(
        Messages.SPRINT_OVERLAP,
        StatusCodes.BAD_REQUEST,
      );
    }

    const newSprint = SprintMapper.toDomain(sprintDTO);

    return await this._sprintRepo.create(newSprint);
  }
}
