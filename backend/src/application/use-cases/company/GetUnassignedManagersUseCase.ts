
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { UnassignedManagerDTO } from "../../dto/company/UnassignedManagerDTO";
import { IGetUnassignedManagers } from "../../interfaces/company/IGetUnassignedManagers";




export class GetUnassignedManagersUseCase implements IGetUnassignedManagers{

    constructor(
        private _managerRepo:IManagerRepository
    ){}

    async execute(): Promise<UnassignedManagerDTO[]> {
         const managers = await this._managerRepo.getUnassignedManagers();
       return managers.map(m => ({ id: m.id!, name: m.name }));
       
    }
}