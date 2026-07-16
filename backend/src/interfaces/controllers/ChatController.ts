import { Response } from "express";
import { ChatEmitter } from "../../shared/events/ChatEmitter";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
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
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }
        console.log(req.body);

        const { receiverId, message } = req.body;
        if (!receiverId) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.RECEIVER_ID_REQUIRED });
            return;
        }

        const file = req.file as Express.Multer.File | undefined;
        let messageType: string | undefined;
        let fileUrl: string | undefined;
        let fileName: string | undefined;
        let fileSize: number | undefined;
        let mimeType: string | undefined;

        if (file) {
          
            fileUrl = (file as { path: string }).path;
            fileName = file.originalname;
            fileSize = file.size;
            mimeType = file.mimetype;

            
            if (file.mimetype.startsWith('image/')) {
                messageType = 'image';
            } else if (file.mimetype.startsWith('video/')) {
                messageType = 'video';
            } else if (file.mimetype.startsWith('audio/')) {
                messageType = 'audio';
            } else {
                messageType = 'document';
            }
        } else {
            messageType = 'text';
        }

        const savedChat = await this._saveChatUseCase.execute(
            senderId,
            receiverId,
            message || "",
            messageType,
            fileUrl,
            fileName,
            fileSize,
            mimeType
        );


        ChatEmitter.emitMessage(receiverId, senderId, message || "", messageType, fileUrl, fileName, fileSize, mimeType);
        res.status(StatusCodes.OK).json({ message: Messages.MESSAGE_SENT, savedChat });
    }


    getTeamForManager = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const team = await this._getTeamForManagerUseCase.execute(userId);
        res.status(StatusCodes.OK).json(team);
    }


    getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const receiverId = req.params.receiverId as string;
        const chats = await this._getChatUseCase.execute(userId, receiverId)
        res.status(StatusCodes.OK).json(chats)

    }

    markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
                return;
            }

            const senderId = req.params.senderId as string;
            if (!senderId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.SENDER_ID_REQUIRED });
                return;
            }

            await this._markMessagesAsReadUseCase.execute(userId, senderId);
            res.status(StatusCodes.OK).json({ message: Messages.MESSAGES_MARKED_AS_READ });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: Messages.FAILED_TO_MARK_AS_READ,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    getUnreadCounts = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
                return;
            }

            const unreadCounts = await this._getUnreadCountsUseCase.execute(userId);
            res.status(StatusCodes.OK).json(unreadCounts);
        } catch (error) {
            console.error("Error getting unread counts:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: Messages.FAILED_TO_GET_UNREAD_COUNTS,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }




}
