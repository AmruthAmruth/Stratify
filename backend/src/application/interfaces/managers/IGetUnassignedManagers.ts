
import { UnassignedManagerDTO } from "../../dto/managers/UnassignedManagerDTO";


export interface IGetUnassignedManagers{
    execute(id:string):Promise<UnassignedManagerDTO[]>
}