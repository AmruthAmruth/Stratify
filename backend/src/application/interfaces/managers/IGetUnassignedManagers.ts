
import { UnassignedManagerDTO } from "../../dto/company/UnassignedManagerDTO";


export interface IGetUnassignedManagers{
    execute(id:string):Promise<UnassignedManagerDTO[]>
}