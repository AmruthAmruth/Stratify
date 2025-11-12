import { Response } from "express";
import { ChatEmitter } from "../../shared/events/ChatEmitter";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { IGetTeamForChatUseCase } from "../../application/interfaces/chat/IGetTeamForChatUseCase";
import { ISaveChatUseCase } from "../../application/interfaces/chat/ISaveChatUseCase";
import { IGetChatUseCase } from "../../application/interfaces/chat/IGetChatUseCase";

export class ChatController {

    constructor(
        private _getTeamForManagerUseCase: IGetTeamForChatUseCase,
        private _saveChatUseCase:ISaveChatUseCase,
        private _getChatUseCase:IGetChatUseCase
    ) {}

  
    sentMessage = async (req: AuthRequest, res: Response): Promise<void> => {
        const senderId = req.userId;
        if (!senderId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }
         console.log(req.body);

        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "receiverId and message are required" });
            return;
        }
          const savedChat = await this._saveChatUseCase.execute(
        senderId,
        receiverId,
        message,
      );


        ChatEmitter.emitMessage(receiverId, senderId, message);
        res.status(StatusCodes.OK).json({ message: "Message sent successfully",savedChat });
    }

    
    getTeamForManager = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const team = await this._getTeamForManagerUseCase.execute(userId);
        res.status(StatusCodes.OK).json(team);
    }


    getChatHistory=async(req:AuthRequest,res:Response):Promise<void>=>{
        const userId=req.userId!;
        const {receiverId}=req.params;
        const chats=await this._getChatUseCase.execute(userId,receiverId)
        res.status(StatusCodes.OK).json(chats)

    }




}
