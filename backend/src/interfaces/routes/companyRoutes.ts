import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { OTPRepository } from "../../infrastructure/repositories/OTPRepository";
import { EmailService } from "../../infrastructure/services/EmailService";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";
import { CompanyRepository } from "../../infrastructure/repositories/CompanyRepository";

const companyRouter = Router()
const companyRepo = new CompanyRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();

const registerUseCase = new RegisterCompanyUseCase(companyRepo, otpRepo, emailService);
const verifyUseCase = new VerifyCompanyOTPUseCase(otpRepo, companyRepo);

const controller = new CompanyController(registerUseCase, verifyUseCase);

companyRouter.post('/register',controller.register)

export default companyRouter;