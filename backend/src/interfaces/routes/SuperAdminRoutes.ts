

import { Router } from "express";
import { superAdminDI } from "../../di/SuperAdminDI";
import { asyncHandler } from "../middleware/AsyncHandler";

const superAdminRouter = Router();

const controllers = superAdminDI();

superAdminRouter.post('/login',asyncHandler(controllers.login))
superAdminRouter.post('/refresh',asyncHandler(controllers.refresh))
superAdminRouter.post('/logout',asyncHandler(controllers.logout))
superAdminRouter.post('/create-plan',asyncHandler(controllers.createPlan))
superAdminRouter.put('/update-plan',asyncHandler(controllers.updatePlan))
superAdminRouter.delete('/delete-plan',asyncHandler(controllers.deletePlan))
export default superAdminRouter