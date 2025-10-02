import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { leaveDI } from "../../di/LeaveDI";

const leaveRouter = Router();
const controller = leaveDI();

leaveRouter.post("/create-leave", authMiddleware(["employee"]), asyncHandler(controller.createLeave));
leaveRouter.get("/leaves", authMiddleware(["employee"]), asyncHandler(controller.getEmployeeLeaves));
leaveRouter.get("/department-leaves", authMiddleware(["manager"]), asyncHandler(controller.getDepartmentLeaves));
leaveRouter.post("/leave-status", asyncHandler(controller.approveLeave));

export default leaveRouter;