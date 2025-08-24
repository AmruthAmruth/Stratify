import { ResendOtpUseCase } from "../application/use-cases/auth/ResendOtpUseCase";
import { SendOtpUseCase } from "../application/use-cases/auth/SendOtpUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/company/CompanyLoginUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/company/ForgotPasswordUseCase";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyByIdUseCase";
import { GetPaginatedCompaniesUsecase } from "../application/use-cases/company/GetPaginatedCompaniesUsecase";
import { RegisterCompanyUseCase } from "../application/use-cases/company/RegisterCompanyUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/company/ResetPasswordUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/company/VerifyCompanyOTPUseCase";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/company/VerifyForgotPasswordOTPUseCase";
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { OTPRepository } from "../infrastructure/repositories/OTPRepository";
import { TempRegistrationRepository } from "../infrastructure/repositories/TempRegistrationRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CompanyController } from "../interfaces/controllers/CompanyController";
export const companyDI = () => {

  const companyRepo = new companyRepository();
  const otpRepo = new OTPRepository();
  const emailService = new EmailService();
  const tempRegRepo = new TempRegistrationRepository();

  const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);

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
  const companyLoginUseCase = new CompanyLoginUseCase(companyRepo);

const resendOtpUseCase = new ResendOtpUseCase(otpRepo,emailService,tempRegRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepo,sendOtpUseCase)
const verifyForgotPasswordOTPUseCase = new VerifyForgotPasswordOTPUseCase(otpRepo,companyRepo)
const resetPasswordUsecase = new ResetPasswordUseCase(companyRepo)
const getPaginatedCompaniesUseCase = new GetPaginatedCompaniesUsecase(companyRepo)
  return new CompanyController(
    registerUseCase, 
    verifyUseCase,
    getCompanyById,
    companyLoginUseCase,
    resendOtpUseCase,
    forgotPasswordUseCase,
    verifyForgotPasswordOTPUseCase,
    resetPasswordUsecase,
    getPaginatedCompaniesUseCase
  );
};
