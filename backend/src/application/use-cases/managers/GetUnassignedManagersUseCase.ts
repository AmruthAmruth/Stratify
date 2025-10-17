import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { UnassignedManagerDTO } from "../../dto/managers/UnassignedManagerDTO";
import { IGetUnassignedManagersUseCase } from "../../interfaces/managers/IGetUnassignedManagersUseCase";

export class GetUnassignedManagersUseCase
  implements IGetUnassignedManagersUseCase
{
  constructor(private _managerRepo: IManagerRepository) {}

  async execute(id: string): Promise<UnassignedManagerDTO[]> {
    const managers = await this._managerRepo.getUnassignedManagers(id);
    return managers.map((m) => ({ id: m.id!, name: m.name }));
  }
}
