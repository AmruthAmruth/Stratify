
import { UnassignedManagerDTO } from "../../dto/managers/UnassignedManagerDTO";


export interface IGetUnassignedManagersUseCase{
    execute(id:string):Promise<UnassignedManagerDTO[]>
}