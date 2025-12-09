import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { superAdminDI } from "../../di/SuperAdminDI";
import { upload } from "../../infrastructure/services/CloudinaryService";

const superAdminRouter = Router();
const controller = superAdminDI();

superAdminRouter.get(
    "/profile",
    authMiddleware(["super-admin"]),
    asyncHandler(controller.getProfile)
);

superAdminRouter.put(
    "/profile",
    authMiddleware(["super-admin"]),
    upload.single("profileImage"),
    asyncHandler(controller.updateProfile)
);

export default superAdminRouter;
