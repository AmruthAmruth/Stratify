import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CreateManagerUseCase } from "../application/use-cases/managers/CreateManagerUseCase";
import { CreateEmployeeUseCase } from "../application/use-cases/employees/CreateEmployeeUseCase";
import { GetUnassignedManagersUseCase } from "../application/use-cases/managers/GetUnassignedManagersUseCase";
import { EmployeeController } from "../interfaces/controllers/EmployeeController";
import { GetMemberForManagerUseCase } from "../application/use-cases/chat/GetMemberForManagerUseCase";
import { GetMemberForEmployeeUseCase } from "../application/use-cases/chat/GetMemberForEmployeeUseCase";

export const employeeDI = () => {
  const companyRepo = new companyRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const emailService = new EmailService();

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
  );
  const getUnassignedManagersUseCase = new GetUnassignedManagersUseCase(
    managerRepo,
  );

  const getMemberForManagerUseCase = new GetMemberForManagerUseCase(
    managerRepo,
    departmentRepo,
    companyRepo,
    employeeRepo,
  );
  const getMemberForEmployeeUseCase = new GetMemberForEmployeeUseCase(
    employeeRepo,
    managerRepo,
    departmentRepo,
    companyRepo,
  );
  
  return new EmployeeController(
    createManagerUseCase,
    createEmployeeUseCase,
    getUnassignedManagersUseCase,
    getMemberForManagerUseCase,
    getMemberForEmployeeUseCase,
  );
};
