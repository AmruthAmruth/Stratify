import { Router } from "express";
import { companyDI } from "../../di/companyDI";
import { upload } from "../../shared/utils/cloudinaryConfig";
import { asyncHandler } from "../middleware/asyncHandler";


const companyRouter = Router();
const controller = companyDI();


companyRouter.post("/register", upload.single("profileImage"),asyncHandler(controller.register));
companyRouter.post("/verify-otp", asyncHandler(controller.verifyOTP));
companyRouter.get("/all-company", asyncHandler(controller.getAllCompanies));
companyRouter.get("/:id", asyncHandler(controller.getCompanyById));
companyRouter.post("/login", asyncHandler(controller.login));
companyRouter.post('/logout',asyncHandler(controller.logout))
companyRouter.post('/resend-otp',asyncHandler(controller.resendOtp))
companyRouter.post('/forgotpassword',asyncHandler(controller.forgotPassword))
companyRouter.post('/forgotpassword-verifyotp',asyncHandler(controller.verifyForgotPasswordOTP))
companyRouter.post('/resetpassword',asyncHandler(controller.resetPassword))
export default companyRouter
