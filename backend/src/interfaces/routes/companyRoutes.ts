import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { OTPRepository } from "../../infrastructure/repositories/OTPRepository";
import { EmailService } from "../../infrastructure/services/EmailService";
import { RegisterCompanyUseCase } from "../../application/use-cases/company/RegisterCompanyUseCase";
import { VerifyCompanyOTPUseCase } from "../../application/use-cases/company/VerifyCompanyOTPUseCase";
import { companyRepository } from "../../infrastructure/repositories/CompanyRepository";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase"; 
import { TempRegistrationRepository } from "../../infrastructure/repositories/TempRegistrationRepository";
import { upload } from "../../shared/utils/cloudinaryConfig";
import { GetAllCompnayUseCase } from "../../application/use-cases/company/GetAllCompaniesUseCase";
import { GetCompanyByIdUseCase } from "../../application/use-cases/company/GetCompanyByIdUseCase";
import { CompanyLoginUseCase } from "../../application/use-cases/company/CompanyLoginUseCase";
const companyRouter = Router();


const companyRepo = new companyRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();
const tempRegRepo= new TempRegistrationRepository()

const sendOtpUseCase = new SendOtpUseCase(otpRepo, emailService);

const registerUseCase = new RegisterCompanyUseCase(companyRepo, sendOtpUseCase,tempRegRepo);
const verifyUseCase = new VerifyCompanyOTPUseCase(otpRepo, companyRepo,tempRegRepo);
const getAllCompaniUseCase = new GetAllCompnayUseCase(companyRepo)
const getCompanyById = new GetCompanyByIdUseCase(companyRepo)
const companyLoginUseCase = new CompanyLoginUseCase(companyRepo)

const controller = new CompanyController(registerUseCase, verifyUseCase,getAllCompaniUseCase,getCompanyById,companyLoginUseCase);

companyRouter.post("/register",upload.single("profileImage"), controller.register);
companyRouter.post("/verify-otp", controller.verifyOTP);
companyRouter.get('/all-company',controller.getAllCompanies);
companyRouter.get('/:id',controller.getCompanyById);
companyRouter.post('/login',controller.login)

export default companyRouter;
