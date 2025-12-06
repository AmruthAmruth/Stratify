import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { GetTeamForChatDTO } from "../../dto/chat/GetTeamForManagerDTO";
import { IGetTeamForChatUseCase } from "../../interfaces/chat/IGetTeamForChatUseCase";

export class GetTeamForChatUseCase implements IGetTeamForChatUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
    private _chatRepo: IChatRepository,
    private _companyRepo: ICompanyRepository
  ) { }

  async execute(userId: string): Promise<GetTeamForChatDTO[]> {

    // Check if user is a company
    const company = await this._companyRepo.findById(userId);
    let teamMembers: Array<{ id: string; name: string }> = [];

    if (company) {
      // Company user: fetch all managers and employees under this company
      const [managers, employees] = await Promise.all([
        this._managerRepo.findByCompanyId(company.id!),
        this._employeeRepo.findByCompanyId(company.id!)
      ]);

      teamMembers = [
        ...managers
          .filter(m => m.id && m.id !== userId)
          .map(m => ({ id: m.id!, name: m.name })),
        ...employees
          .filter(e => e.id && e.id !== userId)
          .map(e => ({ id: e.id!, name: e.name }))
      ];
    } else {
      // Check if user is a manager
      const manager = await this._managerRepo.findById(userId);

      if (manager) {
        // Fetch employees in manager's department
        const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);

        // Fetch the company
        const company = await this._companyRepo.findById(manager.companyId);

        teamMembers = employees
          .filter(emp => emp.id && emp.id !== userId)
          .map(emp => ({
            id: emp.id!,
            name: emp.name,
          }));

        // Add company to the team list
        if (company && company.id) {
          teamMembers.push({
            id: company.id,
            name: company.name,
          });
        }
      } else {
        // User is an employee
        const employee = await this._employeeRepo.findById(userId);
        if (!employee) {
          throw new AppError("User not found as company, manager, or employee");
        }

        const departmentEmployees = await this._employeeRepo.findByDepartmentId(employee.departmentId!);
        const employeeManager = await this._managerRepo.findById(employee.managerId!);
        const company = await this._companyRepo.findById(employee.companyId);

        teamMembers = departmentEmployees
          .filter(emp => emp.id && emp.id !== userId)
          .map(emp => ({
            id: emp.id!,
            name: emp.name,
          }));

        // Add manager to the list
        if (employeeManager && employeeManager.id) {
          const exists = teamMembers.some(member => member.id === employeeManager.id);
          if (!exists) {
            teamMembers.push({
              id: employeeManager.id,
              name: employeeManager.name,
            });
          }
        }

        // Add company to the list
        if (company && company.id) {
          teamMembers.push({
            id: company.id,
            name: company.name,
          });
        }
      }
    }

    if (teamMembers.length === 0) {
      return [];
    }


    const userIds = teamMembers.map(m => m.id);
    const [lastMessagesMap, unreadCountsMap] = await Promise.all([
      this._chatRepo.getLastMessageForUsers(userId, userIds),
      this._chatRepo.getUnreadCounts(userId),
    ]);



    const enrichedTeam: GetTeamForChatDTO[] = teamMembers.map(member => {
      const lastMessage = lastMessagesMap.get(member.id);
      const unreadCount = unreadCountsMap.get(member.id) || 0;

      return {
        id: member.id,
        name: member.name,
        lastMessage: lastMessage?.message,
        lastMessageTime: lastMessage?.createdAt,
        unreadCount,
      };
    });


    enrichedTeam.sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
      }
      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;
      return a.name.localeCompare(b.name);
    });

    return enrichedTeam;
  }
}
