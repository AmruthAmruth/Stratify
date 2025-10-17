import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { OTPRepository } from "../infrastructure/repositories/OTPRepository";
import { TempRegistrationRepository } from "../infrastructure/repositories/TempRegistrationRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { SendOtpUseCase } from "../application/use-cases/authentication/SendOTPUseCase";
import { ResendOtpUseCase } from "../application/use-cases/authentication/ResentOTPUseCase";
import { RegisterCompanyUseCase } from "../application/use-cases/authentication/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../application/use-cases/authentication/VerifyCompanyOTPUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/authentication/ForgotPasswordUseCase";
import { VerifyForgotPasswordOTPUseCase } from "../application/use-cases/authentication/VerifyForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/authentication/ResetPasswordUseCase";
import { CompanyLoginUseCase } from "../application/use-cases/authentication/CompanyLoginUseCase";
import { CreateTrialSubscriptionUseCase } from "../application/use-cases/subscriptions/CreateTrialSubscriptionUseCase";
import { AuthenticationController } from "../interfaces/controllers/AuthenticationController";
import { LoginUseCase } from "../application/use-cases/authentication/LoginUseCase";
import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository";
import { RefreshTokenUseCase } from "../application/use-cases/authentication/RefreashTokenUseCase";

export const authenticationDI = () => {
  const companyRepo = new companyRepository();
  const otpRepo = new OTPRepository();
  const tempRegRepo = new TempRegistrationRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const subscriptionRepo = new SubscriptionRepository();
  const superAdminRepo = new SuperAdminRepository();
  const emailService = new EmailService();

  const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);
  const registerUseCase = new RegisterCompanyUseCase(
    companyRepo,
    sendOtpUseCase,
    tempRegRepo,
  );
  const createTrialSubscriptionUseCase = new CreateTrialSubscriptionUseCase(
    subscriptionRepo,
  );
  const verifyOtpUseCase = new VerifyCompanyOTPUseCase(
    otpRepo,
    companyRepo,
    tempRegRepo,
    createTrialSubscriptionUseCase,
  );
  const loginUseCase = new CompanyLoginUseCase(
    companyRepo,
    managerRepo,
    employeeRepo,
    subscriptionRepo,
  );
  const resendOtpUseCase = new ResendOtpUseCase(
    otpRepo,
    emailService,
    tempRegRepo,
  );
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    companyRepo,
    managerRepo,
    employeeRepo,
    sendOtpUseCase,
  );
  const verifyForgotPasswordOtpUseCase = new VerifyForgotPasswordOTPUseCase(
    otpRepo,
    companyRepo,
    managerRepo,
    employeeRepo,
  );
  const resetPasswordUseCase = new ResetPasswordUseCase(
    companyRepo,
    managerRepo,
    employeeRepo,
  );
  const superAdminLoginUseCase = new LoginUseCase(superAdminRepo);

  const refreshTokenUseCase = new RefreshTokenUseCase();

  return new AuthenticationController(
    registerUseCase,
    verifyOtpUseCase,
    loginUseCase,
    resendOtpUseCase,
    forgotPasswordUseCase,
    verifyForgotPasswordOtpUseCase,
    resetPasswordUseCase,
    superAdminLoginUseCase,
    refreshTokenUseCase,
  );
};
