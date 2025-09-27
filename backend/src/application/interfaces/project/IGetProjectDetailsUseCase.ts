import { GetProjectDetailsDTO } from "../../dto/project/GetProjectDetailsDTO";

export interface IGetProjectDetailsUseCase{
    execute(projectId:string):Promise<GetProjectDetailsDTO>
}