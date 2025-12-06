import { CreateGroupUseCase } from "../application/use-cases/chat/CreateGroupUseCase";
import { SendGroupMessageUseCase } from "../application/use-cases/chat/SendGroupMessageUseCase";
import { GetGroupMessagesUseCase } from "../application/use-cases/chat/GetGroupMessagesUseCase";
import { GetDepartmentGroupsForCompanyUseCase } from "../application/use-cases/chat/GetDepartmentGroupsForCompanyUseCase";
import { GetMyDepartmentGroupUseCase } from "../application/use-cases/chat/GetMyDepartmentGroupUseCase";
import { GroupRepository } from "../infrastructure/repositories/GroupRepository";
import { GroupMessageRepository } from "../infrastructure/repositories/GroupMessageRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { CompanyRepository } from "../infrastructure/repositories/CompanyRepository";
import { GroupChatController } from "../interfaces/controllers/GroupChatController";

export const GroupChatDI = (): GroupChatController => {
    const groupRepo = new GroupRepository();
    const groupMessageRepo = new GroupMessageRepository();
    const departmentRepo = new DepartmentRepository();
    const employeeRepo = new EmployeeRepository();
    const managerRepo = new ManagerRepository();
    const companyRepo = new CompanyRepository();

    const createGroupUseCase = new CreateGroupUseCase(groupRepo);
    const sendGroupMessageUseCase = new SendGroupMessageUseCase(groupMessageRepo);
    const getGroupMessagesUseCase = new GetGroupMessagesUseCase(groupMessageRepo);
    const getDepartmentGroupsForCompanyUseCase = new GetDepartmentGroupsForCompanyUseCase(
        groupRepo,
        departmentRepo,
        employeeRepo,
        managerRepo,
        companyRepo
    );
    const getMyDepartmentGroupUseCase = new GetMyDepartmentGroupUseCase(
        groupRepo,
        departmentRepo,
        employeeRepo,
        managerRepo
    );

    return new GroupChatController(
        createGroupUseCase,
        sendGroupMessageUseCase,
        getGroupMessagesUseCase,
        groupRepo,
        getDepartmentGroupsForCompanyUseCase,
        getMyDepartmentGroupUseCase
    );
};
