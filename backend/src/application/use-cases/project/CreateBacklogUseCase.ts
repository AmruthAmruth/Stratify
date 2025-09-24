import { Backlog } from "../../../domain/entities/Backlog";
import { IBacklogRepository } from "../../../domain/repositories/IBacklogRepository";
import { CreateBacklogDTO } from "../../dto/project/CreateBacklogDTO";
import { ICreateBacklogUseCase } from "../../interfaces/project/ICreateBacklogUseCase";

export class CreateBacklogUseCase implements ICreateBacklogUseCase {
  constructor(private readonly _backlogRepo: IBacklogRepository) {}

  async execute(backlogDTO: CreateBacklogDTO): Promise<Backlog> {
   

    const backlog = new Backlog(
      undefined, 
      backlogDTO.projectId,
      backlogDTO.name,
      backlogDTO.description,
      backlogDTO.createdBy,
      new Date(),
      new Date()
    );

  
    return await this._backlogRepo.create(backlog);
  }
}
