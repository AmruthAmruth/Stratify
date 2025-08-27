

import { Router } from "express";
import { superAdminDI } from "../../di/superAdminDI";
import { asyncHandler } from "../middleware/async-handler";

const superAdminRouter = Router();

const controllers = superAdminDI();

superAdminRouter.post('/login',asyncHandler(controllers.login))
superAdminRouter.post('/refresh',asyncHandler(controllers.refresh))
superAdminRouter.post('/logout',asyncHandler(controllers.logout))

export default superAdminRouter