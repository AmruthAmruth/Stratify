import { GetTeamForManagerDTO } from "../../dto/chat/GetTeamForManagerDTO";


export interface IGetTeamForManagerUseCase{
    execute(managerId:string):Promise<GetTeamForManagerDTO[]>
}