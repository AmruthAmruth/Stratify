import { Response } from "express";
import { ChatEmitter } from "../../shared/events/ChatEmitter";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { IGetTeamForChatUseCase } from "../../application/interfaces/chat/IGetTeamForChatUseCase";
import { ISaveChatUseCase } from "../../application/interfaces/chat/ISaveChatUseCase";
import { IGetChatUseCase } from "../../application/interfaces/chat/IGetChatUseCase";
import { IMarkMessagesAsReadUseCase } from "../../application/interfaces/chat/IMarkMessagesAsReadUseCase";
import { IGetUnreadCountsUseCase } from "../../application/interfaces/chat/IGetUnreadCountsUseCase";

export class ChatController {

    constructor(
        private _getTeamForManagerUseCase: IGetTeamForChatUseCase,
        private _saveChatUseCase: ISaveChatUseCase,
        private _getChatUseCase: IGetChatUseCase,
        private _markMessagesAsReadUseCase: IMarkMessagesAsReadUseCase,
        private _getUnreadCountsUseCase: IGetUnreadCountsUseCase
    ) { }


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
        res.status(StatusCodes.OK).json({ message: "Message sent successfully", savedChat });
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


    getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const { receiverId } = req.params;
        const chats = await this._getChatUseCase.execute(userId, receiverId)
        res.status(StatusCodes.OK).json(chats)

    }

    markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
                return;
            }

            const { senderId } = req.params;
            if (!senderId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "senderId is required" });
                return;
            }

            await this._markMessagesAsReadUseCase.execute(userId, senderId);
            res.status(StatusCodes.OK).json({ message: "Messages marked as read" });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to mark messages as read",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    getUnreadCounts = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
                return;
            }

            const unreadCounts = await this._getUnreadCountsUseCase.execute(userId);
            res.status(StatusCodes.OK).json(unreadCounts);
        } catch (error) {
            console.error("Error getting unread counts:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to get unread counts",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }




}
