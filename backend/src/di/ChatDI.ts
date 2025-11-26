import { GetChatUseCase } from "../application/use-cases/chat/GetChatUseCase";
import { GetTeamForChatUseCase } from "../application/use-cases/chat/GetTeamForChatUseCase";
import { SaveChatUseCase } from "../application/use-cases/chat/SaveChatUseCase";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ChatController } from "../interfaces/controllers/ChatController";
import { MarkMessagesAsReadUseCase } from "../application/use-cases/chat/MarkMessagesAsReadUseCase";
import { GetUnreadCountsUseCase } from "../application/use-cases/chat/GetUnreadCountsUseCase";

export const ChatDI = () => {
  const chatRepository = new ChatRepository();
  const employeeRepository = new EmployeeRepository();
  const managerRepository = new ManagerRepository();

  const getTeamForChatUseCase = new GetTeamForChatUseCase(
    managerRepository,
    employeeRepository,
    chatRepository
  );
  const saveChatUseCase = new SaveChatUseCase(chatRepository);
  const getChatUseCase = new GetChatUseCase(chatRepository);
  const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(chatRepository);
  const getUnreadCountsUseCase = new GetUnreadCountsUseCase(chatRepository);

  return new ChatController(
    getTeamForChatUseCase,
    saveChatUseCase,
    getChatUseCase,
    markMessagesAsReadUseCase,
    getUnreadCountsUseCase
  );
};
