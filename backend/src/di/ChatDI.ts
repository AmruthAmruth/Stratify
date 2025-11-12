
import { GetTeamForChatUseCase } from "../application/use-cases/chat/GetTeamForChatUseCase";
import { SaveChatUseCase } from "../application/use-cases/chat/SaveChatUseCase";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ChatController } from "../interfaces/controllers/ChatController";

export const ChatDI = (): ChatController => {
    const managerRepo = new ManagerRepository();
    const employeeRepo = new EmployeeRepository();
    const chatRepo=new ChatRepository()
    const getTeamForChatUseCase = new GetTeamForChatUseCase(managerRepo, employeeRepo);
      const saveChatUseCase = new SaveChatUseCase(chatRepo)
    return new ChatController(getTeamForChatUseCase,saveChatUseCase);
}
