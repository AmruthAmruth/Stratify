import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { upload } from "../../infrastructure/services/CloudinaryService";
import { authenticationDI } from "../../di/AuthenticationDI";
import { authLimiter, passwordResetLimiter } from "../../config/RateLimiter";
import { validateRequest } from "../middleware/ValidationMiddleware";
import { RegisterCompanySchema } from "../../application/validators/CompanyValidator";
import { LoginSchema } from "../../application/validators/LoginValidator";
import {
  
  ResendOtpSchema,
  ForgotPasswordSchema,
  VerifyForgotPasswordOtpSchema,
  ResetPasswordSchema,
} from "../../application/validators/AuthValidator";

const authRouter = Router();
const controller = authenticationDI();
const optionalProfileUpload = (
  req: any,
  res: any,
  next: any
) => {
  upload.single("profileImage")(req, res, (err?: unknown) => {

    if (err) {
      console.error("Image upload error:", err);

      return next(err);
    }

    next();
  });
};

authRouter.post(
  "/register",
  authLimiter,
  optionalProfileUpload,
  validateRequest(RegisterCompanySchema),
  asyncHandler(controller.register),
);
authRouter.post("/verify-otp", asyncHandler(controller.verifyOtp));
authRouter.post("/login", authLimiter, validateRequest(LoginSchema), asyncHandler(controller.login));
authRouter.post("/logout", asyncHandler(controller.logout));
authRouter.post("/resend-otp", validateRequest(ResendOtpSchema), asyncHandler(controller.resendOtp));
authRouter.post("/forgotpassword", passwordResetLimiter, validateRequest(ForgotPasswordSchema), asyncHandler(controller.forgotPassword));
authRouter.post(
  "/forgotpassword-verifyotp",
  validateRequest(VerifyForgotPasswordOtpSchema),
  asyncHandler(controller.verifyForgotPasswordOtp),
);
authRouter.post("/resetpassword", passwordResetLimiter, validateRequest(ResetPasswordSchema), asyncHandler(controller.resetPassword));
authRouter.post("/super-admin-login", authLimiter, validateRequest(LoginSchema), asyncHandler(controller.superAdminLogin));
authRouter.post("/refresh-token", asyncHandler(controller.refresh));

export default authRouter;
