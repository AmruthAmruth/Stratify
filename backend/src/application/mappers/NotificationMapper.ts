import { Notification } from "../../domain/entities/Notification";
import { CreateNotificationDTO } from "../dto/notification/CreateNotificationDTO";

export class NotificationMapper {

    static toDomain(dto: CreateNotificationDTO): Notification {
        return new Notification(
            dto.userId,
            dto.role.toLowerCase() as "company" | "manager" | "employee",
            dto.title,
            dto.message,
            dto.type,
            false,
            new Date()
        );
    }

    static toResponse(notification: Notification) {
        return {
            id: notification.id,
            userId: notification.userId,
            role: notification.role,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        };
    }

    static toListResponse(notifications: Notification[]) {
        return notifications.map((notification) => this.toResponse(notification));
    }
}
