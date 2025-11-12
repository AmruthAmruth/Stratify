import { GetTeamForManagerUseCase } from "../application/use-cases/chat/GetTeamForManagerUseCase";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ChatController } from "../interfaces/controllers/ChatController";

export const ChatDI = (): ChatController => {
    const managerRepo = new ManagerRepository();
    const employeeRepo = new EmployeeRepository();

    const getTeamForManagerUseCase = new GetTeamForManagerUseCase(managerRepo, employeeRepo);

    return new ChatController(getTeamForManagerUseCase);
}
