import { CreateNotificationUseCase } from "../application/use-cases/notification/CreateNotificationUseCase";
import { DeleteAllNotificationsUseCase } from "../application/use-cases/notification/DeleteAllNotificationsUseCase";
import { DeleteNotificationUseCase } from "../application/use-cases/notification/DeleteNotificationUseCase";
import { GetNotificationUseCase } from "../application/use-cases/notification/GetNotificationUseCase";
import { ToggleReadStatusUseCase } from "../application/use-cases/notification/ToggleReadStatusUseCase";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { NotificationController } from "../interfaces/controllers/NotificationController";

export const notificationDI = () => {
  const notificationRepo = new NotificationRepository();

  const createNotificationUseCase = new CreateNotificationUseCase(
    notificationRepo
  );

  const getNotificationUseCase = new GetNotificationUseCase(notificationRepo);
 const toggleReadStatusUseCase = new ToggleReadStatusUseCase(notificationRepo)
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepo)
const deleteAllNotificationsUSeCase=new DeleteAllNotificationsUseCase(notificationRepo)


  return new NotificationController(
    createNotificationUseCase,
    getNotificationUseCase,
    toggleReadStatusUseCase,
    deleteNotificationUseCase,
    deleteAllNotificationsUSeCase
  );
};
