import { Backlog } from "../../../domain/entities/Backlog";
import { CreateBacklogDTO } from "../../dto/project/CreateBacklogDTO";




export interface ICreateBacklogUseCase{
    execute(backlogDTO:CreateBacklogDTO):Promise<Backlog>
}