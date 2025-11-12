import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { GetTeamForManagerDTO } from "../../dto/chat/GetTeamForManagerDTO";
import { IGetTeamForManagerUseCase } from "../../interfaces/chat/IGetTeamForManagerUseCase";

export class GetTeamForManagerUseCase implements IGetTeamForManagerUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(managerId: string): Promise<GetTeamForManagerDTO[]> {
    
    const manager = await this._managerRepo.findById(managerId);

    if (!manager) {
      throw new Error("Manager not found");
    }

    const departmentId = manager.departmentId;

    const employees = await this._employeeRepo.findByDepartmentId(departmentId!);

    const team: GetTeamForManagerDTO[] = employees.map(emp => ({
      id: emp.id!,
      name: emp.name,
    }));

    return team;
  }
}
