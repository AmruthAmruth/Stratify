import { CreateNotificationUseCase } from "../application/use-cases/notification/CreateNotificationUseCase";
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




  return new NotificationController(
    createNotificationUseCase,
    getNotificationUseCase,
    toggleReadStatusUseCase
  );
};
