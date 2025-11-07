import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IGetNotificationUseCase } from "../../interfaces/notification/IGetNotificationUseCase";



export class GetNotificationUseCase implements IGetNotificationUseCase{
    constructor(
        private _notificationRepository:INotificationRepository
    ){}
    async execute(userId: string): Promise<Notification[]> {
        return await this._notificationRepository.findByUserId(userId)
    }
}