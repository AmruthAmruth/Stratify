import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { managerDI } from "../../di/ManagerDI";
import multer from "multer";
import path from "path";
import fs from "fs";

const managerRouter = Router();
const controller = managerDI();

// Ensure uploads directory exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// Manager profile routes
managerRouter.get(
    "/profile",
    authMiddleware(["manager"]),
    asyncHandler(controller.getProfile)
);

managerRouter.put(
    "/profile",
    authMiddleware(["manager"]),
    upload.single("profileImage"),
    asyncHandler(controller.updateProfile)
);

managerRouter.post(
    "/change-password",
    authMiddleware(["manager"]),
    asyncHandler(controller.changePassword)
);

// Team management routes
managerRouter.get(
    "/team/employees",
    authMiddleware(["manager"]),
    asyncHandler(controller.getDepartmentEmployees)
);

managerRouter.get(
    "/team/analytics",
    authMiddleware(["manager"]),
    asyncHandler(controller.getTeamAnalytics)
);

export default managerRouter;
