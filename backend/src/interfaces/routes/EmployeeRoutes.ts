import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { employeeDI } from "../../di/EmployeeDI";

const employeeRouter = Router();
const controller = employeeDI();

employeeRouter.post("/create-manager", authMiddleware(["company"]), asyncHandler(controller.createManager));
employeeRouter.post("/create-employee", authMiddleware(["company", "manager"]), asyncHandler(controller.createEmployee));
employeeRouter.get("/unassigned-managers", authMiddleware(["company"]), asyncHandler(controller.getUnassignedManagers));
employeeRouter.get("/member-for-manager",authMiddleware(["manager"]),asyncHandler(controller.getMembersForManager))
export default employeeRouter;