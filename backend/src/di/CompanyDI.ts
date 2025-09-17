import { ResendOtpUseCase } from "../application/use-cases/authentication/ResentOTPUseCase";
import { SendOtpUseCase } from "../application/use-cases/authentication/SendOTPUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/authentication/CompanyLoginUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/authentication/ForgotPasswordUseCase";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/ListCompaniesUseCase";
import { RegisterCompanyUseCase } from "../application/use-cases/authentication/RegisterCompanyUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/authentication/ResetPasswordUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/authentication/VerifyCompanyOTPUseCase";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/authentication/VerifyForgotPasswordUseCase";
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { OTPRepository } from "../infrastructure/repositories/OTPRepository";
import { TempRegistrationRepository } from "../infrastructure/repositories/TempRegistrationRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CompanyController } from "../interfaces/controllers/CompanyController";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ApproveCompany } from "../application/use-cases/company/ApproveCompanyUseCase";
import { UnapproveCompany } from "../application/use-cases/company/UnApproveCompanyUseCase";
import { CreateDepartmentUseCase } from "../application/use-cases/departments/CreateDepartmentUseCase";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { CreateManagerUseCase } from "../application/use-cases/managers/CreateManagerUseCase";
import { CreateEmployeeUseCase } from "../application/use-cases/employees/CreateEmployeeUseCase";
import { GetUnassignedManagersUseCase } from "../application/use-cases/managers/GetUnassignedManagersUseCase";
import { GetCompanyDepartmentUseCase } from "../application/use-cases/departments/GetCompanyDepartmentsUseCase";
import { GetDepartmentDetailsUseCase } from "../application/use-cases/departments/GetDepartmentDetailsUseCase";
import { GetCompanyMemebersUseCase } from "../application/use-cases/company/GetCompanyMembersUseCase";
import { GetProfileUseCase } from "../application/use-cases/company/GetProfileUseCase";
import { GetUnassignedDepartmentUseCase } from "../application/use-cases/departments/GetUnassignedDepartments";
import { CreateTrialSubscriptionUseCase } from "../application/use-cases/subscriptions/CreateTrialSubscriptionUseCase";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { PurchaseSubscriptionUseCase } from "../application/use-cases/subscriptions/PurchaseSubscriptionUseCase";
import { RazorpayService } from "../infrastructure/services/RazorpayService";
import { PlanPriceRepostory } from "../infrastructure/repositories/PlanPriceRepository";
import { ListSubscriptionPlansUseCase } from "../application/use-cases/subscriptions/ListSubscriptionPlansUseCase";
import { GetManagerDepartmentsUseCase } from "../application/use-cases/departments/GetDepartmentUnderMangerUseCase";

export const companyDI = () => {

  const companyRepo = new companyRepository();
  const otpRepo = new OTPRepository();
  const emailService = new EmailService();
  const tempRegRepo = new TempRegistrationRepository();
  const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);
const managerRepo = new ManagerRepository()
const employeeRepo = new EmployeeRepository()
const subscriptionRepo = new SubscriptionRepository()
const createTrialSubscriptionUseCase=new CreateTrialSubscriptionUseCase(subscriptionRepo)


  const registerUseCase = new RegisterCompanyUseCase(
    companyRepo,
    sendOtpUseCase,
    tempRegRepo
  );

  const verifyUseCase = new VerifyCompanyOTPUseCase(
    otpRepo,
    companyRepo,
    tempRegRepo,
    createTrialSubscriptionUseCase
  );
 
  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const companyLoginUseCase = new CompanyLoginUseCase(companyRepo,managerRepo,employeeRepo,subscriptionRepo);

const resendOtpUseCase = new ResendOtpUseCase(otpRepo,emailService,tempRegRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepo,managerRepo,employeeRepo,sendOtpUseCase)
const verifyForgotPasswordOTPUseCase = new VerifyForgotPasswordOTPUseCase(otpRepo,companyRepo,managerRepo,employeeRepo)
const resetPasswordUsecase = new ResetPasswordUseCase(companyRepo,managerRepo,employeeRepo)
const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo)


const approveCompanyUseCase = new ApproveCompany(emailService,companyRepo)
const unapproveCompanyUseCase = new UnapproveCompany(emailService,companyRepo)


const departmentRepo = new DepartmentRepository()
const createDepartmentUseCase= new CreateDepartmentUseCase(departmentRepo,managerRepo,companyRepo,emailService)
const createManagerUseCase =new CreateManagerUseCase(companyRepo,managerRepo,departmentRepo,emailService)
const createEmployeeUseCase = new CreateEmployeeUseCase(companyRepo,employeeRepo,departmentRepo,managerRepo,emailService)
const getUnassignedManagers = new GetUnassignedManagersUseCase(managerRepo)
const getUnassignedDepartment= new GetUnassignedDepartmentUseCase(departmentRepo)
const GetCompanyDepartment = new GetCompanyDepartmentUseCase(departmentRepo,managerRepo,employeeRepo)
const GetDepartmentDetails = new GetDepartmentDetailsUseCase(departmentRepo,managerRepo,employeeRepo)
const getCompanyMemebers = new GetCompanyMemebersUseCase(managerRepo,employeeRepo,departmentRepo)
const getProfileOfTeamMemeber= new GetProfileUseCase(managerRepo,employeeRepo,departmentRepo)
const getCompany = new GetCompanyByIdUseCase(companyRepo)

const razorpay = new RazorpayService()
const planRepo = new PlanPriceRepostory()
const subscriptionPurchase = new PurchaseSubscriptionUseCase(subscriptionRepo,planRepo,razorpay,emailService,companyRepo)
const listSubscriptionPlan = new ListSubscriptionPlansUseCase(planRepo)


const getManagerDepartments = new GetManagerDepartmentsUseCase(departmentRepo,employeeRepo)


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
GetCompanyDepartment,
GetDepartmentDetails,
getCompanyMemebers,
getProfileOfTeamMemeber,
getCompany,
getUnassignedDepartment,
subscriptionPurchase,
listSubscriptionPlan,
getManagerDepartments
  );
};
 