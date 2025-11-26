import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { GetTeamForChatDTO } from "../../dto/chat/GetTeamForManagerDTO";
import { IGetTeamForChatUseCase } from "../../interfaces/chat/IGetTeamForChatUseCase";

export class GetTeamForChatUseCase implements IGetTeamForChatUseCase {
  constructor(
    private _managerRepo: IManagerRepository,
    private _employeeRepo: IEmployeeRepository,
    private _chatRepo: IChatRepository
  ) { }

  async execute(userId: string): Promise<GetTeamForChatDTO[]> {
   
    const manager = await this._managerRepo.findById(userId);
    let teamMembers: Array<{ id: string; name: string }> = [];

    if (manager) {
      const employees = await this._employeeRepo.findByDepartmentId(manager.departmentId!);
      teamMembers = employees
        .filter(emp => emp.id && emp.id !== userId)
        .map(emp => ({
          id: emp.id!,
          name: emp.name,
        }));
    } else {

      const employee = await this._employeeRepo.findById(userId);
      if (!employee) {
        throw new AppError("User not found as manager or employee");
      }

      const departmentEmployees = await this._employeeRepo.findByDepartmentId(employee.departmentId!);
      const employeeManager = await this._managerRepo.findById(employee.managerId!);

      teamMembers = departmentEmployees
        .filter(emp => emp.id && emp.id !== userId)
        .map(emp => ({
          id: emp.id!,
          name: emp.name,
        }));

     
      if (employeeManager && employeeManager.id) {
        const exists = teamMembers.some(member => member.id === employeeManager.id);
        if (!exists) {
          teamMembers.push({
            id: employeeManager.id,
            name: employeeManager.name,
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
