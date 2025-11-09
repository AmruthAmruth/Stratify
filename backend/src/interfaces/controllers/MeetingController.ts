import { ICloseMeetingUseCase } from "../../application/interfaces/meeting/ICloseMeetingUseCase";
import { ICreateMeetingUseCase } from "../../application/interfaces/meeting/ICreateMeetingUseCase";
import { IGenerateMeetingTokenUseCase } from "../../application/interfaces/meeting/IGenerateMeetingTokenUseCase";
import { IJoinMeetingUseCase } from "../../application/interfaces/meeting/IJoinMeetingUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { Response,Request } from "express";


export class MeetingController{
    constructor(
          private _createMeetingUseCase:ICreateMeetingUseCase,
          private _generateMeetingTokenUseCase:IGenerateMeetingTokenUseCase,
          private _joinMeetingUseCase:IJoinMeetingUseCase,
          private _closeMeetingUseCase:ICloseMeetingUseCase
    ){}

    createMeeting=async(req:AuthRequest,res:Response):Promise<void>=>{
        const userId=req.userId;
        const {title}=req.body
        const response = await this._createMeetingUseCase.execute(userId!,title);
        res.status(StatusCodes.OK).json({message:"Meeting Created Successfully!",response})
    }

      genarateToken=async(req:AuthRequest,res:Response):Promise<void>=>{
        const {roomId,userName}=req.body;
        const userId=req.userId;
        const token = await this._generateMeetingTokenUseCase.execute(roomId,userId!,userName)
        res.status(StatusCodes.CREATED).json({message:"Token Generated Successfully",token})
      }

      joinMeeting=async(req:Request,res:Response):Promise<void>=>{
        const {roomId}=req.params;
        const meeting= await this._joinMeetingUseCase.execute(roomId);
        res.status(StatusCodes.OK).json(meeting)
      }

      closeMeeting=async(req:Request,res:Response):Promise<void>=>{
        const {roomId}=req.params;
        await this._closeMeetingUseCase.execute(roomId);
        res.status(StatusCodes.OK).json({message:"Meeting Closed Successfully"})
      }



}