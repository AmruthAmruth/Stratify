
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/ListCompaniesUseCase";
import { ApproveCompany } from "../application/use-cases/company/ApproveCompanyUseCase";
import { UnapproveCompany } from "../application/use-cases/company/UnApproveCompanyUseCase";
import { GetCompanyMemebersUseCase } from "../application/use-cases/company/GetCompanyMembersUseCase";
import { GetProfileUseCase } from "../application/use-cases/company/GetProfileUseCase";
import { CompanyController } from "../interfaces/controllers/CompanyController";
import { GetMemberForCompanyUseCase } from "../application/use-cases/chat/GetMemberForCompanyUseCase";

export const companyDI = () => {
  const companyRepo = new companyRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const emailService = new EmailService();

  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo);
  const approveCompanyUseCase = new ApproveCompany(emailService, companyRepo);
  const unapproveCompanyUseCase = new UnapproveCompany(emailService, companyRepo);
  const getCompanyMembers = new GetCompanyMemebersUseCase(managerRepo, employeeRepo, departmentRepo);
  const getTeamMemberProfile = new GetProfileUseCase(managerRepo, employeeRepo, departmentRepo);
   const getMemberForCompanyUseCase = new GetMemberForCompanyUseCase(companyRepo,employeeRepo,managerRepo)
  return new CompanyController(
    getCompanyById,
    getPaginatedCompaniesUseCase,
    approveCompanyUseCase,
    unapproveCompanyUseCase,
    getCompanyMembers,
    getTeamMemberProfile,
    getMemberForCompanyUseCase
  );
};