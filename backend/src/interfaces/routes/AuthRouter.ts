import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { upload } from "../../infrastructure/services/CloudinaryService";
import { authenticationDI } from "../../di/AuthenticationDI";

const authRouter = Router();
const controller = authenticationDI();

authRouter.post("/register", upload.single("profileImage"), asyncHandler(controller.register));
authRouter.post("/verify-otp", asyncHandler(controller.verifyOtp));
authRouter.post("/login", asyncHandler(controller.login));
authRouter.post("/logout", asyncHandler(controller.logout));
authRouter.post("/resend-otp", asyncHandler(controller.resendOtp));
authRouter.post("/forgotpassword", asyncHandler(controller.forgotPassword));
authRouter.post("/forgotpassword-verifyotp", asyncHandler(controller.verifyForgotPasswordOtp));
authRouter.post("/resetpassword", asyncHandler(controller.resetPassword));
authRouter.post("/super-admin-login",asyncHandler(controller.superAdminLogin))
authRouter.post("/refresh-token",asyncHandler(controller.refresh))
export default authRouter;