import { Notification } from "../../domain/entities/Notification";
import { emitNotification } from "../../infrastructure/socket/SocketServer";

export class NotificationEmitter {
  static async emit(notification: Notification) {
    const { io } = await import("../../main");

    if (io) {
      emitNotification(
        io,
        notification.userId,
        notification.message
      );
    }
  }
}
