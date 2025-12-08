import { CompanyRepository } from "../infrastructure/repositories/CompanyRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CreateManagerUseCase } from "../application/use-cases/managers/CreateManagerUseCase";
import { CreateEmployeeUseCase } from "../application/use-cases/employees/CreateEmployeeUseCase";
import { GetUnassignedManagersUseCase } from "../application/use-cases/managers/GetUnassignedManagersUseCase";
import { EmployeeController } from "../interfaces/controllers/EmployeeController";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { GetEmployeeDashboardStats } from "../application/use-cases/employee/GetEmployeeDashboardStats";
import { IssueRepository } from "../infrastructure/repositories/IssueRepository";

export const employeeDI = () => {
  const companyRepo = new CompanyRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const emailService = new EmailService();
  const notificationRepo = new NotificationRepository();
  const issueRepo = new IssueRepository();

  const createManagerUseCase = new CreateManagerUseCase(
    companyRepo,
    managerRepo,
    departmentRepo,
    emailService,
  );
  const createEmployeeUseCase = new CreateEmployeeUseCase(
    companyRepo,
    employeeRepo,
    departmentRepo,
    managerRepo,
    emailService,
    notificationRepo
  );
  const getUnassignedManagersUseCase = new GetUnassignedManagersUseCase(
    managerRepo,
  );

  const getEmployeeDashboardStats = new GetEmployeeDashboardStats(issueRepo);

  return new EmployeeController(
    createManagerUseCase,
    createEmployeeUseCase,
    getUnassignedManagersUseCase,
    getEmployeeDashboardStats
  );
};
