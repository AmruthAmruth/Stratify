
import { CreateNotificationUseCase } from "../application/use-cases/notification/CreateNotificationUseCase";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { NotificationController } from "../interfaces/controllers/NotificationController";






export const notificationDI=()=>{
    const notificationRepo = new NotificationRepository();

 const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);


   return new NotificationController(createNotificationUseCase);
}