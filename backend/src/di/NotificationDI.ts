
import { CreateNotificationUseCase } from "../application/use-cases/notification/CreateNotificationUseCase";
import { GetNotificationUseCase } from "../application/use-cases/notification/GetNotificationUseCase";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { NotificationController } from "../interfaces/controllers/NotificationController";






export const notificationDI=()=>{
    const notificationRepo = new NotificationRepository();

 const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);

const getNotificationUseCase = new GetNotificationUseCase(notificationRepo)
   return new NotificationController(createNotificationUseCase,getNotificationUseCase);
}