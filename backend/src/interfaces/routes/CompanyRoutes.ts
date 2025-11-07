import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { companyDI } from "../../di/CompanyDI";

const companyRouter = Router();
const controller = companyDI();

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
companyRouter.post("/approve-company", asyncHandler(controller.approveCompany));
companyRouter.post(
  "/unapprove-company",
  asyncHandler(controller.unapproveCompany),
);

export default companyRouter;
