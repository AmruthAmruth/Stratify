import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { companyDI } from "../../di/CompanyDI";
import { emitNotification } from "../../infrastructure/socket/SocketServer";
import { io } from "../../main";

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




companyRouter.post("/test",(_req,res)=>{
 const sample = {
    title: "Server Test",
    role:"company",
    message: "If you see this, socket works!",
    type: "info",
    userId: "hello",
  };
  emitNotification(io,sample.userId,sample)
  res.json({status:"Notificatin is emmited"})
})



export default companyRouter;
