import { ResendOtpUseCase } from "../application/use-cases/auth/ResentOTPUseCase";
import { SendOtpUseCase } from "../application/use-cases/auth/SendOTPUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/auth/CompanyLoginUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/auth/ForgotPasswordUseCase";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/ListCompaniesUseCase";
import { RegisterCompanyUseCase } from "../application/use-cases/auth/RegisterCompanyUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/auth/ResetPasswordUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/auth/VerifyCompanyOTPUseCase";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/auth/VerifyForgotPasswordUseCase";
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { OTPRepository } from "../infrastructure/repositories/OTPRepository";
import { TempRegistrationRepository } from "../infrastructure/repositories/TempRegistrationRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CompanyController } from "../interfaces/controllers/CompanyController";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ApproveCompany } from "../application/use-cases/company/ApproveCompanyUseCase";
import { UnapproveCompany } from "../application/use-cases/company/UnApproveCompanyUseCase";
import { CreateDepartmentUseCase } from "../application/use-cases/company/CreateDepartmentUseCase";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
export const companyDI = () => {

  const companyRepo = new companyRepository();
  const otpRepo = new OTPRepository();
  const emailService = new EmailService();
  const tempRegRepo = new TempRegistrationRepository();
  const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);
const managerRepo = new ManagerRepository()
const employeeRepo = new EmployeeRepository()



  const registerUseCase = new RegisterCompanyUseCase(
    companyRepo,
    sendOtpUseCase,
    tempRegRepo
  );

  const verifyUseCase = new VerifyCompanyOTPUseCase(
    otpRepo,
    companyRepo,
    tempRegRepo
  );
 
  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const companyLoginUseCase = new CompanyLoginUseCase(companyRepo,managerRepo,employeeRepo);

const resendOtpUseCase = new ResendOtpUseCase(otpRepo,emailService,tempRegRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepo,managerRepo,employeeRepo,sendOtpUseCase)
const verifyForgotPasswordOTPUseCase = new VerifyForgotPasswordOTPUseCase(otpRepo,companyRepo,managerRepo,employeeRepo)
const resetPasswordUsecase = new ResetPasswordUseCase(companyRepo,managerRepo,employeeRepo)
const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo)


const approveCompanyUseCase = new ApproveCompany(emailService,companyRepo)
const unapproveCompanyUseCase = new UnapproveCompany(emailService,companyRepo)


const departmentRepo = new DepartmentRepository()
const createDepartmentUseCase= new CreateDepartmentUseCase(departmentRepo,managerRepo,companyRepo,emailService)



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
    createDepartmentUseCase
  );
};
 