import { GetChatUseCase } from "../application/use-cases/chat/GetChatUseCase";
import { GetTeamForChatUseCase } from "../application/use-cases/chat/GetTeamForChatUseCase";
import { SaveChatUseCase } from "../application/use-cases/chat/SaveChatUseCase";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { CompanyRepository } from "../infrastructure/repositories/CompanyRepository";
import { ChatController } from "../interfaces/controllers/ChatController";
import { MarkMessagesAsReadUseCase } from "../application/use-cases/chat/MarkMessagesAsReadUseCase";
import { GetUnreadCountsUseCase } from "../application/use-cases/chat/GetUnreadCountsUseCase";

export const ChatDI = () => {
  const chatRepo = new ChatRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const companyRepo = new CompanyRepository();

  const getTeamForChatUseCase = new GetTeamForChatUseCase(
    managerRepo,
    employeeRepo,
    chatRepo,
    companyRepo
  );
  const saveChatUseCase = new SaveChatUseCase(chatRepo);
  const getChatUseCase = new GetChatUseCase(chatRepo);
  const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(chatRepo);
  const getUnreadCountsUseCase = new GetUnreadCountsUseCase(chatRepo);

  const controller = new ChatController(
    getTeamForChatUseCase,
    saveChatUseCase,
    getChatUseCase,
    markMessagesAsReadUseCase,
    getUnreadCountsUseCase
  );

  return controller;
};
