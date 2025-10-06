
import { Sprint } from "../../../domain/entities/Sprint";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { CreateSprintDTO } from "../../dto/project/CreateSprintDTO";
import { ICreateSprintUseCase } from "../../interfaces/project/ICreateSprintUseCase";

export class CreateSprentUseCase implements ICreateSprintUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _sprintRepo: ISprintRepository
  ) {}
  async execute(sprintDTO: CreateSprintDTO): Promise<Sprint> {
    const project = await this._projectRepo.findById(sprintDTO.projectId);
    if (!project) {
      throw new AppError("Project not found", StatusCodes.NOT_FOUND);
    }



 const overlappingSprint = await this._sprintRepo.findOverlappingSprint(
      sprintDTO.projectId,
      sprintDTO.startDate,
      sprintDTO.endDate
    );

    if (overlappingSprint) {
      throw new AppError(
        `Sprint overlaps with existing sprint "${overlappingSprint.name}"`,
        StatusCodes.BAD_REQUEST
      );
    }


     const newSprint = new Sprint(
      undefined, 
      sprintDTO.name,
      sprintDTO.goal,
      new Date(sprintDTO.startDate),
      new Date(sprintDTO.endDate),
      sprintDTO.projectId,
      sprintDTO.status ?? "Planned" 
    );

     const createdSprint = await this._sprintRepo.create(newSprint);

    return createdSprint;

  }
}
