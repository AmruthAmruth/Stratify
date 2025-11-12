
import { GetTeamForChatUseCase } from "../application/use-cases/chat/GetTeamForChatUseCase";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ChatController } from "../interfaces/controllers/ChatController";

export const ChatDI = (): ChatController => {
    const managerRepo = new ManagerRepository();
    const employeeRepo = new EmployeeRepository();

    const getTeamForChatUseCase = new GetTeamForChatUseCase(managerRepo, employeeRepo);

    return new ChatController(getTeamForChatUseCase);
}
