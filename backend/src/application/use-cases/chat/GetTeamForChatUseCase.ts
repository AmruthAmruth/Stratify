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
    // Check if user is a manager
    const manager = await this._managerRepo.findById(userId);

    if (manager) {
      // Manager: return all employees in their department
      const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);

      return employees
        .filter(emp => emp.id)
        .map(emp => ({
          id: emp.id!,
          name: emp.name,
        }));
    }

    // If user is an employee
    const employee = await this._employeeRepo.findById(userId);
    if (!employee) {
      throw new AppError("User not found as manager or employee");
    }

    // Get all employees in the same department
    const departmentEmployees = await this._employeeRepo.findByDepartmentId(employee.departmentId!);

    // Get employee's manager
    const employeeManager = await this._managerRepo.findById(employee.managerId!);

    const team: GetTeamForChatDTO[] = [];

    // Add all employees in the department
    team.push(
      ...departmentEmployees
        .filter(emp => emp.id)
        .map(emp => ({
          id: emp.id!, 
          name: emp.name,
        }))
    );

    // Add manager if exists and not already in the list
    if (employeeManager) {
      const exists = team.some(member => member.id === employeeManager.id);
      if (!exists) {
        team.push({
          id: employeeManager.id!,
          name: employeeManager.name,
        });
      }
    }

    return team;
  }
}
