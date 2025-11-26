import { Notification } from "../../domain/entities/Notification";
import { emitNotification } from "../../infrastructure/socket/SocketServer";

export class NotificationEmitter {
  static emit(notification: Notification) {
    // Lazy load io to avoid circular dependency with main.ts -> MeetingScheduler -> GenerateDailyStandupsUseCase -> NotificationEmitter
    const { io } = require("../../main");
    if (io) {
      emitNotification(
        io,
        notification.userId,
        notification.message
      );
    }
  }
}