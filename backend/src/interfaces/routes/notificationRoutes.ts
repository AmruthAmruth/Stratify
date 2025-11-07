import express from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { notificationDI } from "../../di/NotificationDI";

const notificationRouter = express.Router();
const controller = notificationDI()

notificationRouter.post('/',authMiddleware(["company","manager","employee"]),asyncHandler(controller.createNotification))

export default notificationRouter