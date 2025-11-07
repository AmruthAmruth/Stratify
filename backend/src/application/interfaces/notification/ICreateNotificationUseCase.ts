import { Notification } from "../../../domain/entities/Notification";
import { CreateNotificationDTO } from "../../dto/notification/CreateNotificationDTO";

export interface ICreateNotificationUseCase{
    execute(data:CreateNotificationDTO):Promise<Notification>
}

