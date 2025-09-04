import { Router } from "express";
import { companyDI } from "../../di/companyDI";
import { upload } from "../../infrastructure/services/cloudinary-service";
import { asyncHandler } from "../middleware/async-handler";
import { authMiddleware } from "../middleware/auth-middleware";


const companyRouter = Router();
const controller = companyDI();  

 
companyRouter.post("/register", upload.single("profileImage"),asyncHandler(controller.register));
companyRouter.post("/verify-otp", asyncHandler(controller.verifyOTP));
companyRouter.post("/login", asyncHandler(controller.login));
companyRouter.post('/logout',asyncHandler(controller.logout))
companyRouter.post('/resend-otp',asyncHandler(controller.resendOtp))
companyRouter.post('/forgotpassword',asyncHandler(controller.forgotPassword))
companyRouter.post('/forgotpassword-verifyotp',asyncHandler(controller.verifyForgotPasswordOTP))
companyRouter.post('/resetpassword',asyncHandler(controller.resetPassword))
companyRouter.get('/companies',asyncHandler(controller.getPaginatedCompanies))
companyRouter.get('/departments',authMiddleware(['company']),asyncHandler(controller.getDepartmentDetailsInACompany))
companyRouter.get('/employee',authMiddleware(["company", "manager"]),asyncHandler(controller.getAllEmployeeByCompanyId))

companyRouter.get("/:id", asyncHandler(controller.getCompanyById));
companyRouter.post('/department',authMiddleware(['company']),asyncHandler(controller.createDepartmentWithManager))
companyRouter.post('/create-employee',authMiddleware(["company", "manager"]),asyncHandler(controller.createEmployee))
companyRouter.post('/approve-company',asyncHandler(controller.approveCompany))
companyRouter.post('/unapprove-company',asyncHandler(controller.unapproveCompany))
export default companyRouter
  