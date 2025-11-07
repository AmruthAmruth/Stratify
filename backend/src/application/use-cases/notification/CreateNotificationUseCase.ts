import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { CreateNotificationDTO } from "../../dto/notification/CreateNotificationDTO";
import { ICreateNotificationUseCase } from "../../interfaces/notification/ICreateNotificationUseCase";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(private _notificationRepo: INotificationRepository) {}

  async execute(data: CreateNotificationDTO): Promise<Notification> {
    const notification = new Notification(
      "",
      data.userId,
      data.role.toLowerCase() as "company" | "manager" | "employee",
      data.title,
      data.message,
      data.type,
      false,
      new Date()
    );
    const savedNotification = await this._notificationRepo.create(notification);
    console.log("Created successfully");
    
    return savedNotification;
  }
}
