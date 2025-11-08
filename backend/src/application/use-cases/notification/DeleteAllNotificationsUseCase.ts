import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IDeleteAllNotificationsUseCase } from "../../interfaces/notification/IDeleteAllNotificationsUseCase";

export class DeleteAllNotificationsUseCase implements IDeleteAllNotificationsUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepository.deleteAll(userId);
  }

}