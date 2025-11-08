import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IToggleReadStatusUseCase } from "../../interfaces/notification/IToggleReadStatusUseCase";


export class ToggleReadStatusUseCase implements IToggleReadStatusUseCase{
    constructor(
        private _notificationRepository: INotificationRepository
    ){}

    async execute(notificationId: string): Promise<void> {
         const notification = await this._notificationRepository.findById(notificationId);
    if (!notification) {
      throw new AppError("Notification not found", StatusCodes.NOT_FOUND);
    }

 await this._notificationRepository.updateReadStatus(notificationId)


    }
}