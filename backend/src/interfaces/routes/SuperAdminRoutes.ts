

import { Router } from "express";
import { superAdminDI } from "../../di/SuperAdminDI";
import { asyncHandler } from "../middleware/AsyncHandler";

const superAdminRouter = Router();

const controllers = superAdminDI();

superAdminRouter.post('/login',asyncHandler(controllers.login))
superAdminRouter.post('/refresh',asyncHandler(controllers.refresh))
superAdminRouter.post('/logout',asyncHandler(controllers.logout))
superAdminRouter.post('/plan-create',asyncHandler(controllers.createPlan))
export default superAdminRouter