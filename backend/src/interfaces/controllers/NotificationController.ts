import { Response } from "express";
import { ICreateNotificationUseCase } from "../../application/interfaces/notification/ICreateNotificationUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { AuthRequest } from "../middleware/AuthMiddleware";
import {io,} from '../../main'
import { emitNotification } from "../../infrastructure/socket/NotificationSocket";
import { IGetNotificationUseCase } from "../../application/interfaces/notification/IGetNotificationUseCase";


export class NotificationController{
         constructor(
            private _createNotificationUseCase:ICreateNotificationUseCase,
            private _getNotificationUseCase:IGetNotificationUseCase
         ){}
        
         createNotification=async(req:AuthRequest,res:Response):Promise<void>=>{
            const userId = req.userId;
            const role=req.role
            
            const notificationDTO ={...req.body,userId,role}
            const response = await this._createNotificationUseCase.execute(notificationDTO)
            emitNotification(io, notificationDTO.userId, req.body.message);
            res.status(StatusCodes.CREATED).json({message:"Notification Created Successfully!",response})

         }

   getNotificationByUserId=async(req:AuthRequest,res:Response):Promise<void>=>{
      const userId = req.userId;
      const response = await this._getNotificationUseCase.execute(userId!)
      res.status(StatusCodes.OK).json({message:"All Notification",response})
   }



}