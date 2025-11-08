import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  updateReadStatus(id:string):Promise<void>
  findById(id:string):Promise<Notification>
  delete(id:string):Promise<void>
  deleteAll(userId:string):Promise<void>
}