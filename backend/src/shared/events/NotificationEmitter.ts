import { Notification } from "../../domain/entities/Notification";
import { emitNotification } from "../../infrastructure/socket/NotificationSocket";
import { io } from "../../main";

 

export class NotificationEmitter {
  static emit(notification: Notification) {
    emitNotification(
      io,
      notification.userId,
      notification.message
    );
  }
}