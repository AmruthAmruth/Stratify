import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { departmentDI } from "../../di/DepartmentDI";

const departmentRouter = Router();
const controller = departmentDI();

departmentRouter.post(
  "/create-department",
  authMiddleware(["company"]),
  asyncHandler(controller.createDepartment),
);
departmentRouter.get(
  "/company-departments",
  authMiddleware(["company"]),
  asyncHandler(controller.getCompanyDepartments),
);
departmentRouter.get(
  "/department-details/:id", 
  asyncHandler(controller.getDepartmentDetails),
);
departmentRouter.get(
  "/unassigned-department",
  authMiddleware(["company"]),
  asyncHandler(controller.getUnassignedDepartments),
);
departmentRouter.get(
  "/manager-departments/:managerId",
  asyncHandler(controller.getManagerDepartments),
);

export default departmentRouter;
