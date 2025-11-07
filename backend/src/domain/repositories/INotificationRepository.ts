import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}