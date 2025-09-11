import { Router } from "express";
import { companyDI } from "../../di/CompanyDI";
import { upload } from "../../infrastructure/services/CloudinaryService";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";

const companyRouter = Router();
const controller = companyDI();  

// 🔹 Auth & basic flows
companyRouter.post("/register", upload.single("profileImage"), asyncHandler(controller.register));
companyRouter.post("/verify-otp", asyncHandler(controller.verifyOTP));
companyRouter.post("/login", asyncHandler(controller.login));
companyRouter.post("/logout", asyncHandler(controller.logout));
companyRouter.post("/resend-otp", asyncHandler(controller.resendOtp));
companyRouter.post("/forgotpassword", asyncHandler(controller.forgotPassword));
companyRouter.post("/forgotpassword-verifyotp", asyncHandler(controller.verifyForgotPasswordOTP));
companyRouter.post("/resetpassword", asyncHandler(controller.resetPassword));

// 🔹 Company-related actions
companyRouter.get("/companies", asyncHandler(controller.getPaginatedCompanies));
companyRouter.get("/unassigned-managers", asyncHandler(controller.getUnassignedManager));
companyRouter.get('/company-departments',authMiddleware(["company"]),asyncHandler(controller.getCompanyDepartments))
companyRouter.get('/department-details',asyncHandler(controller.getDepartmentDetails))
companyRouter.get('/company-employees',authMiddleware(["company"]),asyncHandler(controller.getCompanyMembers))
companyRouter.get('/team-member-profile',asyncHandler(controller.getProfileOfTeamMemeber))



companyRouter.post("/approve-company", asyncHandler(controller.approveCompany));
companyRouter.post("/unapprove-company", asyncHandler(controller.unapproveCompany));

// 🔹 Creation routes
companyRouter.post("/create-department", authMiddleware(["company"]), asyncHandler(controller.createDepartment));
companyRouter.post("/create-manager", authMiddleware(["company"]), asyncHandler(controller.createManager));
companyRouter.post("/create-employee", authMiddleware(["company", "manager"]), asyncHandler(controller.createEmployee));



export default companyRouter;
