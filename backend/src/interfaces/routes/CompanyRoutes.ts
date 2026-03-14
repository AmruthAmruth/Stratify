import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { companyDI } from "../../di/CompanyDI";
import { companyThemeDI } from "../../di/CompanyThemeDI";
import { emitNotification } from "../../infrastructure/socket/SocketServer";
import { io } from "../../main";
import { validateRequest } from "../middleware/ValidationMiddleware";
import {
  UpdateCompanyProfileSchema,
  ApproveCompanySchema,
  UnapproveCompanySchema,
  UpdateThemeSchema,
  ApplyPresetSchema,
} from "../../application/validators/CompanyValidator";

const companyRouter = Router();
const controller = companyDI();
const themeController = companyThemeDI();

companyRouter.get("/companies", asyncHandler(controller.getPaginatedCompanies));
companyRouter.get("/company/:id", asyncHandler(controller.getCompanyById));
companyRouter.get(
  "/company-employees",
  authMiddleware(["company"]),
  asyncHandler(controller.getCompanyMembers),
);

companyRouter.get(
  "/team-member-profile/:id",
  asyncHandler(controller.getTeamMemberProfile),
);

companyRouter.get(
  "/company-analytics",
  authMiddleware(["company"]),
  asyncHandler(controller.getCompanyAnalytics),
);

companyRouter.put(
  "/profile",
  authMiddleware(["company"]),
  validateRequest(UpdateCompanyProfileSchema),
  asyncHandler(controller.updateProfile),
);

companyRouter.post("/approve-company", validateRequest(ApproveCompanySchema), asyncHandler(controller.approveCompany));
companyRouter.post(
  "/unapprove-company",
  validateRequest(UnapproveCompanySchema),
  asyncHandler(controller.unapproveCompany),
);

// Theme routes
companyRouter.get(
  "/theme/:companyId",
  authMiddleware(["company", "manager", "employee"]),
  asyncHandler(themeController.getCompanyTheme),
);

companyRouter.put(
  "/theme",
  authMiddleware(["company"]),
  validateRequest(UpdateThemeSchema),
  asyncHandler(themeController.updateCompanyTheme),
);

companyRouter.get(
  "/theme-presets",
  authMiddleware(["company"]),
  asyncHandler(themeController.getThemePresets),
);

companyRouter.post(
  "/theme/apply-preset",
  authMiddleware(["company"]),
  validateRequest(ApplyPresetSchema),
  asyncHandler(themeController.applyPreset),
);




companyRouter.post("/test", (_req, res) => {
  const sample = {
    title: "Server Test",
    role: "company",
    message: "If you see this, socket works!",
    type: "info",
    userId: "hello",
  };
  emitNotification(io, sample.userId, sample)
  res.json({ status: "Notificatin is emmited" })
})



export default companyRouter;

