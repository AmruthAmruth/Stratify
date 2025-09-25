import { Sprint } from "../../../domain/entities/Sprint";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { CreateSprintDTO } from "../../dto/project/CreateSprintDTO";
import { ICreateSprintUseCase } from "../../interfaces/project/ICreateSprintUseCase";





export class CreateSprintUseCase implements ICreateSprintUseCase{
    constructor(
            private _sprintRepo:ISprintRepository,
            private _projectRepo: IProjectRepository
    ){}

    async execute(sprintDTO: CreateSprintDTO): Promise<Sprint> {


 const project = await this._projectRepo.findById(sprintDTO.projectId);
    if (!project) throw new AppError("Project not found", 404);



    const overlappingSprint = await this._sprintRepo.findOverlappingSprint(
      sprintDTO.projectId,
      sprintDTO.startDate,
      sprintDTO.endDate
    );

    if (overlappingSprint) {
      throw new AppError(
        `Sprint overlaps with existing sprint "${overlappingSprint.name}"`,
        400
      );
    }


  const now = new Date();


         const sprint = new Sprint(
      undefined,
      sprintDTO.name,
      sprintDTO.description,
      sprintDTO.projectId,
      sprintDTO.startDate,
      sprintDTO.endDate,
      sprintDTO.status ?? "Planned", 
      sprintDTO.teamCapacity,
      0,
      sprintDTO.createdBy,
      now, 
      now
         );
         
    return await this._sprintRepo.create(sprint);
    }

}