import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { GetTeamForChatDTO } from "../../dto/chat/GetTeamForManagerDTO";
import { IGetTeamForChatUseCase } from "../../interfaces/chat/IGetTeamForChatUseCase";

export class GetTeamForChatUseCase implements IGetTeamForChatUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository
  ) {}

  async execute(userId: string): Promise<GetTeamForChatDTO[]> {
   
    const manager = await this._managerRepo.findById(userId);

    if (manager) {
      
      const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);

      return employees
        .filter(emp => emp.id) 
        .map(emp => ({
          id: emp.id!,
          name: emp.name,
        }));
    }

    const employee = await this._employeeRepo.findById(userId);
    if (!employee) {
      throw new AppError("User not found as manager or employee");
    }

    
    const employeeManager = await this._managerRepo.findById(employee.managerId!);

    const team: GetTeamForChatDTO[] = [];

    
    team.push({
      id: employee.id!,
      name: employee.name,
    });

    
    if (employeeManager) {
      team.push({
        id: employeeManager.id!,
        name: employeeManager.name,
      });
    }

    return team;
  }
}
