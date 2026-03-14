import express from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { notificationDI } from "../../di/NotificationDI";
import { validateRequest } from "../middleware/ValidationMiddleware";
import { CreateNotificationSchema, UpdateNotificationStatusSchema } from "../../application/validators/OtherValidators";

const notificationRouter = express.Router();
const controller = notificationDI();

notificationRouter
  .route("/")
  .post(
    authMiddleware(["company", "manager", "employee"]),
    validateRequest(CreateNotificationSchema),
    asyncHandler(controller.createNotification)
  )
  .get(
    authMiddleware(["company", "manager", "employee"]),
    asyncHandler(controller.getNotificationByUserId)
  )

notificationRouter.post(
  "/update-status",
  validateRequest(UpdateNotificationStatusSchema),
  asyncHandler(controller.toggleReadStatus)
);
notificationRouter.delete(
  "/delete-notification/:id",
  asyncHandler(controller.deleteNotification)
);
notificationRouter.delete(
  "/delete-all-notification",
  authMiddleware(["company", "manager", "employee"]),
  asyncHandler(controller.deleteAllNotificatins)
);

notificationRouter.post('/read-all', authMiddleware(["company", "employee", "manager"]), asyncHandler(controller.readAllNotification))
export default notificationRouter;
