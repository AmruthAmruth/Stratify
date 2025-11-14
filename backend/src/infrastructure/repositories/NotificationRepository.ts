import { Notification } from "../../domain/entities/Notification";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";
import { NotificationModel } from "../models/NotificationModel";

export class NotificationRepository implements INotificationRepository {
  
  async create(notification: Notification): Promise<Notification> {
    const newNotif = new NotificationModel({
      userId: notification.userId,
      role: notification.role,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });

    const saved = await newNotif.save();

    return new Notification(
      saved.userId.toString(),
      saved.role as "company" | "manager" | "employee",
      saved.title,
      saved.message,
      saved.type,
      saved.isRead,
      saved.createdAt,
      saved.id.toString()
    );
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });

    return notifications.map(
      (n) =>
        new Notification(
          n.userId.toString(),
          n.role as "company" | "manager" | "employee",
          n.title,
          n.message,
          n.type,
          n.isRead,
          n.createdAt,
          n.id.toString()
        )
    );
  }

  async findById(id: string): Promise<Notification> {
    const notification = await NotificationModel.findById(id);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return new Notification(
      notification.userId.toString(),
      notification.role as "company" | "manager" | "employee",
      notification.title,
      notification.message,
      notification.type,
      notification.isRead,
      notification.createdAt,
      notification.id.toString()
    );
  }

  async markAsRead(id: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(id, { isRead: true });
  }

  async updateReadStatus(id: string): Promise<void> {
    const notification = await NotificationModel.findById(id);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    notification.isRead = !notification.isRead;
    await notification.save();
  }

  async delete(id: string): Promise<void> {
    const notification = await NotificationModel.findById(id);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    await NotificationModel.findByIdAndDelete(id);
  }

  async deleteAll(userId: string): Promise<void> {
    const result = await NotificationModel.deleteMany({ userId });

    if (result.deletedCount === 0) {
      throw new AppError("No notifications found for this user", 404);
    }
  }

  async markAsReadAll(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
