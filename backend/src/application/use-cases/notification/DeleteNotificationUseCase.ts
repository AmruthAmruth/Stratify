import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IDeleteNotificationUseCase } from "../../interfaces/notification/IDeleteNotificationUseCase";

export class DeleteNotificationUseCase implements IDeleteNotificationUseCase {
  constructor(
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this._notificationRepository.delete(id);
  }
}
