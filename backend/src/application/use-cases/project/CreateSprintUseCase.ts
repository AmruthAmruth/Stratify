import { Sprint } from "../../../domain/entities/Sprint";
import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { CreateSprintDTO } from "../../dto/project/CreateSprintDTO";
import { ICreateSprintUseCase } from "../../interfaces/project/ICreateSprintUseCase";





export class CreateSprintUseCase implements ICreateSprintUseCase{
    constructor(
            private _sprintRepo:ISprintRepository
    ){}

    async execute(sprintDTO: CreateSprintDTO): Promise<Sprint> {
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
      new Date(), 
      new Date()  
    );
    return await this._sprintRepo.create(sprint);
    }

}