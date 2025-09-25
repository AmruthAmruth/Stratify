import { CompanyController } from "../interfaces/controllers/CompanyController";

// Repositories
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { OTPRepository } from "../infrastructure/repositories/OTPRepository";
import { TempRegistrationRepository } from "../infrastructure/repositories/TempRegistrationRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { UserStoryRepository } from "../infrastructure/repositories/UserStoryRepository";
import { BacklogRepository } from "../infrastructure/repositories/BacklogRepository";
import { SprintRepository } from "../infrastructure/repositories/SprintRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";

// Services
import { EmailService } from "../infrastructure/services/EmailService";
import { RazorpayService } from "../infrastructure/services/RazorpayService";

// Authentication Use Cases
import { SendOtpUseCase } from "../application/use-cases/authentication/SendOTPUseCase";
import { ResendOtpUseCase } from "../application/use-cases/authentication/ResentOTPUseCase";
import { RegisterCompanyUseCase } from "../application/use-cases/authentication/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/authentication/VerifyCompanyOTPUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/authentication/ForgotPasswordUseCase";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/authentication/VerifyForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/authentication/ResetPasswordUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/authentication/CompanyLoginUseCase";

// Company Use Cases
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/ListCompaniesUseCase";
import { ApproveCompany } from "../application/use-cases/company/ApproveCompanyUseCase";
import { UnapproveCompany } from "../application/use-cases/company/UnApproveCompanyUseCase";
import { GetCompanyMemebersUseCase } from "../application/use-cases/company/GetCompanyMembersUseCase";
import { GetProfileUseCase } from "../application/use-cases/company/GetProfileUseCase";

// Department Use Cases
import { CreateDepartmentUseCase } from "../application/use-cases/departments/CreateDepartmentUseCase";
import { GetCompanyDepartmentUseCase } from "../application/use-cases/departments/GetCompanyDepartmentsUseCase";
import { GetDepartmentDetailsUseCase } from "../application/use-cases/departments/GetDepartmentDetailsUseCase";
import { GetUnassignedDepartmentUseCase } from "../application/use-cases/departments/GetUnassignedDepartments";
import { GetManagerDepartmentsUseCase } from "../application/use-cases/departments/GetDepartmentUnderMangerUseCase";

// Manager & Employee Use Cases
import { CreateManagerUseCase } from "../application/use-cases/managers/CreateManagerUseCase";
import { GetUnassignedManagersUseCase } from "../application/use-cases/managers/GetUnassignedManagersUseCase";
import { CreateEmployeeUseCase } from "../application/use-cases/employees/CreateEmployeeUseCase";

// Subscription Use Cases
import { CreateTrialSubscriptionUseCase } from "../application/use-cases/subscriptions/CreateTrialSubscriptionUseCase";
import { PurchaseSubscriptionUseCase } from "../application/use-cases/subscriptions/PurchaseSubscriptionUseCase";
import { ListSubscriptionPlansUseCase } from "../application/use-cases/subscriptions/ListSubscriptionPlansUseCase";

// Project & Task Use Cases
import { CreateProjectUseCase } from "../application/use-cases/project/CreateProjectUseCase";
import { CreateUserStoryUseCase } from "../application/use-cases/project/CreateUserStoryUseCase";
import { CreateBacklogUseCase } from "../application/use-cases/project/CreateBacklogUseCase";
import { CreateSprintUseCase } from "../application/use-cases/project/CreateSprintUseCase";
import { CreateTaskUseCase } from "../application/use-cases/project/CreateTaskUseCase";
import { GetProjectsByCompanyUseCase } from "../application/use-cases/project/GetProjectsByCompanyUseCase";
import { GetProjectsByDepartmentUseCase } from "../application/use-cases/project/GetProjectsByDepartmentUseCase";

// Leave Use Case
import { CreateLeaveUseCase } from "../application/use-cases/leave/CreateLeaveUseCase";

export const companyDI = () => {
  // Repositories
  const companyRepo = new companyRepository();
  const otpRepo = new OTPRepository();
  const tempRegRepo = new TempRegistrationRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const subscriptionRepo = new SubscriptionRepository();
  const planRepo = new PlanPriceRepostory();
  const projectRepo = new ProjectRepository();
  const userStoryRepo = new UserStoryRepository();
  const backlogRepo = new BacklogRepository();
  const sprintRepo = new SprintRepository();
  const taskRepo = new TaskRepository();
  const leaveRepo = new LeaveRepository();

  // Services
  const emailService = new EmailService();
  const razorpay = new RazorpayService();

  // Authentication Use Cases
  const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);
  const registerUseCase = new RegisterCompanyUseCase(companyRepo, sendOtpUseCase, tempRegRepo);
  const createTrialSubscriptionUseCase = new CreateTrialSubscriptionUseCase(subscriptionRepo);
  const verifyUseCase = new VerifyCompanyOTPUseCase(otpRepo, companyRepo, tempRegRepo, createTrialSubscriptionUseCase);
  const companyLoginUseCase = new CompanyLoginUseCase(companyRepo, managerRepo, employeeRepo, subscriptionRepo);
  const resendOtpUseCase = new ResendOtpUseCase(otpRepo, emailService, tempRegRepo);
  const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepo, managerRepo, employeeRepo, sendOtpUseCase);
  const verifyForgotPasswordOTPUseCase = new VerifyForgotPasswordOTPUseCase(otpRepo, companyRepo, managerRepo, employeeRepo);
  const resetPasswordUsecase = new ResetPasswordUseCase(companyRepo, managerRepo, employeeRepo);

  // Company Use Cases
  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const getCompany = new GetCompanyByIdUseCase(companyRepo);
  const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo);
  const approveCompanyUseCase = new ApproveCompany(emailService, companyRepo);
  const unapproveCompanyUseCase = new UnapproveCompany(emailService, companyRepo);
  const getCompanyMemebers = new GetCompanyMemebersUseCase(managerRepo, employeeRepo, departmentRepo);
  const getProfileOfTeamMemeber = new GetProfileUseCase(managerRepo, employeeRepo, departmentRepo);

  // Department Use Cases
  const createDepartmentUseCase = new CreateDepartmentUseCase(departmentRepo, managerRepo, companyRepo, emailService);
  const getUnassignedDepartment = new GetUnassignedDepartmentUseCase(departmentRepo);
  const getCompanyDepartment = new GetCompanyDepartmentUseCase(departmentRepo, managerRepo, employeeRepo);
  const getDepartmentDetails = new GetDepartmentDetailsUseCase(departmentRepo, managerRepo, employeeRepo);
  const getManagerDepartments = new GetManagerDepartmentsUseCase(departmentRepo, employeeRepo);

  // Manager & Employee Use Cases
  const createManagerUseCase = new CreateManagerUseCase(companyRepo, managerRepo, departmentRepo, emailService);
  const createEmployeeUseCase = new CreateEmployeeUseCase(companyRepo, employeeRepo, departmentRepo, managerRepo, emailService);
  const getUnassignedManagers = new GetUnassignedManagersUseCase(managerRepo);

  // Subscription Use Cases
  const subscriptionPurchase = new PurchaseSubscriptionUseCase(subscriptionRepo, planRepo, razorpay, emailService, companyRepo);
  const listSubscriptionPlan = new ListSubscriptionPlansUseCase(planRepo);

  // Project & Task Use Cases
  const createProject = new CreateProjectUseCase(projectRepo, companyRepo, managerRepo, departmentRepo, employeeRepo);
  const createUserStory = new CreateUserStoryUseCase(userStoryRepo, backlogRepo, projectRepo, employeeRepo);
  const createBackLog = new CreateBacklogUseCase(backlogRepo, companyRepo, managerRepo, projectRepo);
  const createSprint = new CreateSprintUseCase(sprintRepo, projectRepo);
  const createTask = new CreateTaskUseCase(taskRepo, userStoryRepo, employeeRepo, projectRepo);
  const getProjectsByCompany = new GetProjectsByCompanyUseCase(projectRepo, managerRepo, departmentRepo);
  const getProjectsByDepartment = new GetProjectsByDepartmentUseCase(projectRepo);

  // Leave Use Case
  const createLeave = new CreateLeaveUseCase(leaveRepo, employeeRepo);

  return new CompanyController(
    registerUseCase,
    verifyUseCase,
    getCompanyById,
    companyLoginUseCase,
    resendOtpUseCase,
    forgotPasswordUseCase,
    verifyForgotPasswordOTPUseCase,
    resetPasswordUsecase,
    getPaginatedCompaniesUseCase,
    approveCompanyUseCase,
    unapproveCompanyUseCase,
    createDepartmentUseCase,
    createManagerUseCase,
    createEmployeeUseCase,
    getUnassignedManagers,
    getCompanyDepartment,
    getDepartmentDetails,
    getCompanyMemebers,
    getProfileOfTeamMemeber,
    getCompany,
    getUnassignedDepartment,
    subscriptionPurchase,
    listSubscriptionPlan,
    getManagerDepartments,
    createProject,
    createUserStory,
    createBackLog,
    createSprint,
    createTask,
    createLeave,
    getProjectsByCompany,
    getProjectsByDepartment
  );
};
