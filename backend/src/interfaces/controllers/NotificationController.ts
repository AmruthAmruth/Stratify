import { Response, Request } from "express";
import { ICreateNotificationUseCase } from "../../application/interfaces/notification/ICreateNotificationUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { IGetNotificationUseCase } from "../../application/interfaces/notification/IGetNotificationUseCase";
import { IToggleReadStatusUseCase } from "../../application/interfaces/notification/IToggleReadStatusUseCase";
import { IDeleteNotificationUseCase } from "../../application/interfaces/notification/IDeleteNotificationUseCase";
import { IDeleteAllNotificationsUseCase } from "../../application/interfaces/notification/IDeleteAllNotificationsUseCase";
import { IReadAllNotificationUseCase } from "../../application/interfaces/notification/IReadAllNotificaionUseCase";


export class NotificationController {
   constructor(
      private _createNotificationUseCase: ICreateNotificationUseCase,
      private _getNotificationUseCase: IGetNotificationUseCase,
      private _toggleReadStatusUseCase: IToggleReadStatusUseCase,
      private _deleteNotificationUseCase: IDeleteNotificationUseCase,
      private _deleteAllNotificationUseCase: IDeleteAllNotificationsUseCase,
      private _readAllNotificaionUseCase: IReadAllNotificationUseCase
   ) { }

   createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.userId;
      const role = req.role

      const notificationDTO = { ...req.body, userId, role }
      const response = await this._createNotificationUseCase.execute(notificationDTO)

      res.status(StatusCodes.CREATED).json({ message: Messages.NOTIFICATION_CREATED, response })

   }

   getNotificationByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.userId;
      const response = await this._getNotificationUseCase.execute(userId!)
      res.status(StatusCodes.OK).json({ message: Messages.ALL_NOTIFICATIONS, response })
   }


   toggleReadStatus = async (req: Request, res: Response): Promise<void> => {
      const { id } = req.body

      await this._toggleReadStatusUseCase.execute(id!)
      res.status(StatusCodes.OK).json({ message: Messages.NOTIFICATION_STATUS_UPDATED })
   }

   deleteNotification = async (req: Request, res: Response): Promise<void> => {
      const id = req.params.id;
      console.log(id);

      await this._deleteNotificationUseCase.execute(id);
      res.status(StatusCodes.OK).json({ message: Messages.NOTIFICATION_DELETED })
   }

   deleteAllNotificatins = async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.userId
      await this._deleteAllNotificationUseCase.execute(userId!)
      res.status(StatusCodes.OK).json({ message: Messages.ALL_NOTIFICATIONS_DELETED })
   }

   readAllNotification = async (req: AuthRequest, _res: Response): Promise<void> => {
      const userId = req.userId;
      await this._readAllNotificaionUseCase.execute(userId!)
   }

}   