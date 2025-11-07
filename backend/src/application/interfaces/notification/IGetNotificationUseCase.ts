import { Notification } from "../../../domain/entities/Notification";

export interface IGetNotificationUseCase {
    execute(userId:string):Promise<Notification[]>
}