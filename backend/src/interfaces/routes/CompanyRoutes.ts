import { Router } from "express";
import { companyDI } from "../../di/CompanyDI";
import { upload } from "../../infrastructure/services/CloudinaryService";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";

const companyRouter = Router();
const controller = companyDI();  


companyRouter.post("/register", upload.single("profileImage"), asyncHandler(controller.register));
companyRouter.post("/verify-otp", asyncHandler(controller.verifyOTP));
companyRouter.post("/login", asyncHandler(controller.login));
companyRouter.post("/logout", asyncHandler(controller.logout));
companyRouter.post("/resend-otp", asyncHandler(controller.resendOtp));
companyRouter.post("/forgotpassword", asyncHandler(controller.forgotPassword));
companyRouter.post("/forgotpassword-verifyotp", asyncHandler(controller.verifyForgotPasswordOTP));
companyRouter.post("/resetpassword", asyncHandler(controller.resetPassword));


companyRouter.get("/companies", asyncHandler(controller.getPaginatedCompanies));
companyRouter.get("/unassigned-managers",authMiddleware(["company"]),asyncHandler(controller.getUnassignedManager));
companyRouter.get("/unassigned-department",authMiddleware(["company"]),asyncHandler(controller.getUnassignedDepartment));
companyRouter.get('/company-departments',authMiddleware(["company"]),asyncHandler(controller.getCompanyDepartments))
companyRouter.get('/company-employees',authMiddleware(["company"]),asyncHandler(controller.getCompanyMembers))
companyRouter.get('/subscription-plans',asyncHandler(controller.listPlans))


companyRouter.get('/company-projects',authMiddleware(["company"]),asyncHandler(controller.getProjectsByCompany))
companyRouter.get('/department-projects',authMiddleware(["manager"]),asyncHandler(controller.getProjectsByDepartment))


companyRouter.get('/leaves',authMiddleware(["employee"]),asyncHandler(controller.getEmployeeCurrentMouthLeave))
companyRouter.get('/department-leaves',authMiddleware(["manager"]),asyncHandler(controller.getDepartmentLeaves))


companyRouter.get('/project/:id',asyncHandler(controller.getProjectDetails))

companyRouter.get('/team-member-profile/:id',asyncHandler(controller.getProfileOfTeamMemeber))
companyRouter.get('/department-details/:id', asyncHandler(controller.getDepartmentDetails))
companyRouter.get('/company/:id',asyncHandler(controller.getCompany))
companyRouter.get('/manager-departments/:managerId',asyncHandler(controller.getDepartmentsByAManager))







companyRouter.post("/approve-company", asyncHandler(controller.approveCompany));
companyRouter.post("/unapprove-company", asyncHandler(controller.unapproveCompany));


companyRouter.post("/create-department", authMiddleware(["company"]), asyncHandler(controller.createDepartment));
companyRouter.post("/create-manager", authMiddleware(["company"]), asyncHandler(controller.createManager));
companyRouter.post("/create-employee", authMiddleware(["company", "manager"]), asyncHandler(controller.createEmployee));

companyRouter.post("/purchase",authMiddleware(["company"]),asyncHandler(controller.purchasePlan))
companyRouter.post("/verify-payment",authMiddleware(["company"]),asyncHandler(controller.verifyPayment));

companyRouter.post('/purchase-unauthenticated',asyncHandler(controller.createSubscriptionPlanForUnauthenticated))
companyRouter.post('/verify-payment-unauthorized',asyncHandler(controller.verifyPaymentForUnauthenticated))

companyRouter.post('/create-project',authMiddleware(["company","manager"]),asyncHandler(controller.createProject))
companyRouter.post('/create-user-story',authMiddleware(["company","manager"]),asyncHandler(controller.createUserStory))
companyRouter.post('/create-backlog',authMiddleware(["company","manager"]),asyncHandler(controller.createBackLog))
companyRouter.post('/create-sprint',authMiddleware(["company","manager"]),asyncHandler(controller.createSprint))
companyRouter.post('/create-task',asyncHandler(controller.createTask))
companyRouter.post('/assigned-to-sprint',authMiddleware(["company","manager"]),asyncHandler(controller.assignUserStoryToSprint))

companyRouter.post('/create-leave',authMiddleware(["employee"]),asyncHandler(controller.createLeave))




export default companyRouter;
 