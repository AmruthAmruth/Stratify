import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { upload } from "../../infrastructure/services/CloudinaryService";
import { authenticationDI } from "../../di/AuthenticationDI";
import { authLimiter, passwordResetLimiter } from "../../config/RateLimiter";

const authRouter = Router();
const controller = authenticationDI();

authRouter.post(
  "/register",
  authLimiter,
  upload.single("profileImage"),
  asyncHandler(controller.register),
);
authRouter.post("/verify-otp", asyncHandler(controller.verifyOtp));
authRouter.post("/login", authLimiter, asyncHandler(controller.login));
authRouter.post("/logout", asyncHandler(controller.logout));
authRouter.post("/resend-otp", asyncHandler(controller.resendOtp));
authRouter.post("/forgotpassword", passwordResetLimiter, asyncHandler(controller.forgotPassword));
authRouter.post(
  "/forgotpassword-verifyotp",
  asyncHandler(controller.verifyForgotPasswordOtp),
);
authRouter.post("/resetpassword", passwordResetLimiter, asyncHandler(controller.resetPassword));
authRouter.post("/super-admin-login", authLimiter, asyncHandler(controller.superAdminLogin));
authRouter.post("/refresh-token", asyncHandler(controller.refresh));






export default authRouter;
