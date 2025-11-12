import { GetTeamForChatDTO } from "../../dto/chat/GetTeamForManagerDTO";


export interface IGetTeamForChatUseCase{
    execute(managerId:string):Promise<GetTeamForChatDTO[]>
}