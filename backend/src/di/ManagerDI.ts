import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";
import { GetManagerProfileUseCase } from "../application/use-cases/managers/GetManagerProfileUseCase";
import { UpdateManagerProfileUseCase } from "../application/use-cases/managers/UpdateManagerProfileUseCase";
import { ChangeManagerPasswordUseCase } from "../application/use-cases/managers/ChangeManagerPasswordUseCase";
import { GetDepartmentEmployeesUseCase } from "../application/use-cases/managers/GetDepartmentEmployeesUseCase";
import { GetTeamAnalyticsUseCase } from "../application/use-cases/managers/GetTeamAnalyticsUseCase";
import { ManagerController } from "../interfaces/controllers/ManagerController";

export const managerDI = () => {
    const managerRepo = new ManagerRepository();
    const projectRepo = new ProjectRepository();
    const employeeRepo = new EmployeeRepository();
    const leaveRepo = new LeaveRepository();

    const getManagerProfileUseCase = new GetManagerProfileUseCase(
        managerRepo,
        projectRepo
    );

    const updateManagerProfileUseCase = new UpdateManagerProfileUseCase(
        managerRepo
    );

    const changeManagerPasswordUseCase = new ChangeManagerPasswordUseCase(
        managerRepo
    );

    const getDepartmentEmployeesUseCase = new GetDepartmentEmployeesUseCase(
        managerRepo,
        employeeRepo
    );

    const getTeamAnalyticsUseCase = new GetTeamAnalyticsUseCase(
        managerRepo,
        employeeRepo,
        projectRepo,
        leaveRepo
    );

    return new ManagerController(
        getManagerProfileUseCase,
        updateManagerProfileUseCase,
        changeManagerPasswordUseCase,
        getDepartmentEmployeesUseCase,
        getTeamAnalyticsUseCase
    );
};
