import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { employeeDI } from "../../di/EmployeeDI";

const employeeRouter = Router();
const controller = employeeDI();

employeeRouter.post(
  "/create-manager",
  authMiddleware(["company"]),
  asyncHandler(controller.createManager),
);
employeeRouter.post(
  "/create-employee",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.createEmployee),
);
employeeRouter.get(
  "/unassigned-managers",
  authMiddleware(["company"]),
  asyncHandler(controller.getUnassignedManagers),
);

employeeRouter.get(
  "/dashboard-stats",
  authMiddleware(["employee"]),
  asyncHandler(controller.getDashboardStats),
);

employeeRouter.get(
  "/profile",
  authMiddleware(["employee"]),
  asyncHandler(controller.getProfile),
);

employeeRouter.put(
  "/profile",
  authMiddleware(["employee"]),
  asyncHandler(controller.updateProfile),
);

export default employeeRouter;
