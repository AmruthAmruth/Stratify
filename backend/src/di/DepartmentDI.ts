
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CreateDepartmentUseCase } from "../application/use-cases/departments/CreateDepartmentUseCase";
import { GetCompanyDepartmentUseCase } from "../application/use-cases/departments/GetCompanyDepartmentsUseCase";
import { GetDepartmentDetailsUseCase } from "../application/use-cases/departments/GetDepartmentDetailsUseCase";
import { GetUnassignedDepartmentUseCase } from "../application/use-cases/departments/GetUnassignedDepartments";
import { GetManagerDepartmentsUseCase } from "../application/use-cases/departments/GetDepartmentUnderMangerUseCase";
import { DepartmentController } from "../interfaces/controllers/DepartmentController";

export const departmentDI = () => {
  const companyRepo = new companyRepository();
  const departmentRepo = new DepartmentRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const emailService = new EmailService();

  const createDepartmentUseCase = new CreateDepartmentUseCase(departmentRepo, managerRepo, companyRepo, emailService);
  const getCompanyDepartmentsUseCase = new GetCompanyDepartmentUseCase(departmentRepo, managerRepo, employeeRepo);
  const getDepartmentDetailsUseCase = new GetDepartmentDetailsUseCase(departmentRepo, managerRepo, employeeRepo);
  const getUnassignedDepartmentsUseCase = new GetUnassignedDepartmentUseCase(departmentRepo);
  const getManagerDepartmentsUseCase = new GetManagerDepartmentsUseCase(departmentRepo, employeeRepo);

  return new DepartmentController(
    createDepartmentUseCase,
    getCompanyDepartmentsUseCase,
    getDepartmentDetailsUseCase,
    getUnassignedDepartmentsUseCase,
    getManagerDepartmentsUseCase
  );
};