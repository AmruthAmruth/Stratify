
import { Response } from "express";
import { ChatEmitter } from "../../shared/events/ChatEmitter";
import { AuthRequest } from "../middleware/AuthMiddleware";


export class ChatController{
    sentMessage=async(req:AuthRequest,res:Response):Promise<void>=>{
        const senderId=req.userId!;
        const {receiverId,message}=req.body;
          console.log(req.body);
          
        ChatEmitter.emitMessage(receiverId,senderId,message);
        res.status(200).json({message:"Message sent successfully"})
    }
}