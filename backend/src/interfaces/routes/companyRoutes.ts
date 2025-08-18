import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { OTPRepository } from "../../infrastructure/repositories/OTPRepository";
import { EmailService } from "../../infrastructure/services/EmailService";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";
import { CompanyRepository } from "../../infrastructure/repositories/CompanyRepository";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase"; // adjust path
import { TempRegistrationRepository } from "../../infrastructure/repositories/TempRegistrationRepository";
import { upload } from "../../shared/utils/cloudinaryConfig";
const companyRouter = Router();


const companyRepo = new CompanyRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();
const tempRegRepo= new TempRegistrationRepository()

const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);

const registerUseCase = new RegisterCompanyUseCase(companyRepo, sendOtpUseCase,tempRegRepo);
const verifyUseCase = new VerifyCompanyOTPUseCase(otpRepo, companyRepo,tempRegRepo);

const controller = new CompanyController(registerUseCase, verifyUseCase);

companyRouter.post("/register",upload.single("profileImage"), controller.register);
companyRouter.post("/verify-otp", controller.verifyOTP);

export default companyRouter;
