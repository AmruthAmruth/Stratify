import { ResendOtpUseCase } from "../application/use-cases/auth/resent-otp-use-case";
import { SendOtpUseCase } from "../application/use-cases/auth/send-otp-use-case";
import { AddDepartmentWithManagerUseCase } from "../application/use-cases/company/add-department-with-manager-use-case";
import { CompanyLoginUseCase } from "../application/use-cases/auth/company-login-use-case";
import { ForgotPasswordUseCase } from "../application/use-cases/auth/forgot-password-use-case";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/get-company-by-id-use-case";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/get-paginated-company-use-case";
import { RegisterCompanyUseCase } from "../application/use-cases/auth/register-company-use-case";
import { ResetPasswordUseCase } from "../application/use-cases/auth/reset-password-use-case";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/auth/verify-company-otp-use-case";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/auth/verify-forgot-password-use-case";
import { companyRepository } from "../infrastructure/repositories/company-repository";
import { DepartmentRepository } from "../infrastructure/repositories/department-repository";
import { ManagerRepository } from "../infrastructure/repositories/manager-repository";
import { OTPRepository } from "../infrastructure/repositories/otp-repository";
import { TempRegistrationRepository } from "../infrastructure/repositories/temp-registration-repo";
import { EmailService } from "../infrastructure/services/email-service";
import { CompanyController } from "../interfaces/controllers/company-controller";
import { EmployeeRepository } from "../infrastructure/repositories/employee-repository";
import {  CreateEmployeeUseCase } from "../application/use-cases/company/create-employee-use-case";
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
const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepo,sendOtpUseCase)
const verifyForgotPasswordOTPUseCase = new VerifyForgotPasswordOTPUseCase(otpRepo,companyRepo)
const resetPasswordUsecase = new ResetPasswordUseCase(companyRepo)
const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo)

const departmentRepo = new DepartmentRepository();

const addDepartmentWithManagerUseCase = new AddDepartmentWithManagerUseCase(
  departmentRepo,
  managerRepo,
  companyRepo,
  emailService
);


 const createEmployeUseCase = new CreateEmployeeUseCase(employeeRepo,departmentRepo,emailService)
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
    addDepartmentWithManagerUseCase,
    createEmployeUseCase

  );
};
 