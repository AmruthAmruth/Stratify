import { SendOtpUseCase } from "../application/use-cases/auth/SendOtpUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/company/CompanyLoginUseCase";
import { GetAllCompnayUseCase } from "../application/use-cases/company/GetAllCompaniesUseCase";
import { GetCompanyByIdUseCase } from "../application/use-cases/company/GetCompanyByIdUseCase";
import { RegisterCompanyUseCase } from "../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/company/VerifyCompanyOTPUseCase";
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
  const getAllCompaniesUseCase = new GetAllCompnayUseCase(companyRepo);
  const getCompanyById = new GetCompanyByIdUseCase(companyRepo);
  const companyLoginUseCase = new CompanyLoginUseCase(companyRepo);

  return new CompanyController(
    registerUseCase,
    verifyUseCase,
    getAllCompaniesUseCase,
    getCompanyById,
    companyLoginUseCase
  );
};
