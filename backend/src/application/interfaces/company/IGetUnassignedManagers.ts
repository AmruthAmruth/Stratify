
import { UnassignedManagerDTO } from "../../dto/company/UnassignedManagerDTO";


export interface IGetUnassignedManagers{
    execute():Promise<UnassignedManagerDTO[]>
}