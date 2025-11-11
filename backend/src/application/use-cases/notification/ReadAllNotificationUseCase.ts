import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IReadAllNotificationUseCase } from "../../interfaces/notification/IReadAllNotificaionUseCase";


export class ReadAllNotificaionUseCase implements IReadAllNotificationUseCase{
    constructor(
        private _notificaitonRepo:INotificationRepository
    ){}

    async execute(userId: string): Promise<void> {
        await this._notificaitonRepo.markAsReadAll(userId)
    }
}