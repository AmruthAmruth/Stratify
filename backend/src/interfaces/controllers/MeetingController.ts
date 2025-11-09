import { ICreateMeetingUseCase } from "../../application/interfaces/meeting/ICreateMeetingUseCase";
import { IGenerateMeetingTokenUseCase } from "../../application/interfaces/meeting/IGenerateMeetingTokenUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { Response } from "express";


export class MeetingController{
    constructor(
          private _createMeetingUseCase:ICreateMeetingUseCase,
          private _generateMeetingTokenUseCase:IGenerateMeetingTokenUseCase
    ){}

    createMeeting=async(req:AuthRequest,res:Response):Promise<void>=>{
        const userId=req.userId;
        const title=req.body
        const response = await this._createMeetingUseCase.execute(userId!,title);
        res.status(StatusCodes.OK).json({message:"Meeting Created Successfully!",response})
    }

      genarateToken=async(req:AuthRequest,res:Response):Promise<void>=>{
        const {roomId,userName}=req.body;
        const userId=req.userId;
        const token = await this._generateMeetingTokenUseCase.execute(roomId,userId!,userName)
        res.status(StatusCodes.CREATED).json({message:"Token Generated Successfully",token})
      }


}