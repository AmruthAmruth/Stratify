import { CompanyRepository } from "../infrastructure/repositories/CompanyRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";
import { MeetingRepository } from "../infrastructure/repositories/MeetingRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/ListCompaniesUseCase";
import { ApproveCompany } from "../application/use-cases/company/ApproveCompanyUseCase";
import { UnapproveCompany } from "../application/use-cases/company/UnApproveCompanyUseCase";
import { GetCompanyMemebersUseCase } from "../application/use-cases/company/GetCompanyMembersUseCase";
import { GetProfileUseCase } from "../application/use-cases/company/GetProfileUseCase";
import { GetCompanyAnalyticsUseCase } from "../application/use-cases/company/GetCompanyAnalyticsUseCase";
import { CompanyController } from "../interfaces/controllers/CompanyController";

export const companyDI = () => {
  const companyRepo = new CompanyRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const projectRepo = new ProjectRepository();
  const leaveRepo = new LeaveRepository();
  const meetingRepo = new MeetingRepository();
  const emailService = new EmailService();

  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(
    companyRepo,
  );
  const approveCompanyUseCase = new ApproveCompany(emailService, companyRepo);
  const unapproveCompanyUseCase = new UnapproveCompany(
    emailService,
    companyRepo,
  );
  const getCompanyMembers = new GetCompanyMemebersUseCase(
    managerRepo,
    employeeRepo,
    departmentRepo,
  );
  const getTeamMemberProfile = new GetProfileUseCase(
    managerRepo,
    employeeRepo,
    departmentRepo,
  );
  const getCompanyAnalytics = new GetCompanyAnalyticsUseCase(
    departmentRepo,
    employeeRepo,
    managerRepo,
    projectRepo,
    leaveRepo,
    meetingRepo,
  );

  return new CompanyController(
    getCompanyById,
    getPaginatedCompaniesUseCase,
    approveCompanyUseCase,
    unapproveCompanyUseCase,
    getCompanyMembers,
    getTeamMemberProfile,
    getCompanyAnalytics,
  );
};

