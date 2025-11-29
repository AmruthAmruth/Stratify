import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationEmitter } from "../../../shared/events/NotificationEmitter";
import { CreateNotificationDTO } from "../../dto/notification/CreateNotificationDTO";
import { ICreateNotificationUseCase } from "../../interfaces/notification/ICreateNotificationUseCase";
import { NotificationMapper } from "../../mappers/NotificationMapper";
import { Notification } from "../../../domain/entities/Notification";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(private _notificationRepo: INotificationRepository) { }

  async execute(data: CreateNotificationDTO): Promise<Notification> {
    const notification = NotificationMapper.toDomain(data);

    const savedNotification = await this._notificationRepo.create(notification);
    NotificationEmitter.emit(savedNotification);

    return savedNotification;
  }
}
