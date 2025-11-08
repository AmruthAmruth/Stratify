import express from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { notificationDI } from "../../di/NotificationDI";

const notificationRouter = express.Router();
const controller = notificationDI()

notificationRouter
  .route('/')
  .post(
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler(controller.createNotification)
  )
  .get(
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler(controller.getNotificationByUserId)
  );

  notificationRouter.post('/update-status',asyncHandler(controller.toggleReadStatus))
  notificationRouter.post('/delete-notification',asyncHandler(controller.deleteNotification))
   notificationRouter.post('/delete-all-notification',authMiddleware(["company","manager","employee"]),asyncHandler(controller.deleteNotification))
export default notificationRouter