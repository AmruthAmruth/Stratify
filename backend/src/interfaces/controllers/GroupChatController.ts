import { Response } from "express";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { ICreateGroupUseCase } from "../../application/interfaces/chat/ICreateGroupUseCase";
import { ISendGroupMessageUseCase } from "../../application/interfaces/chat/ISendGroupMessageUseCase";
import { IGetGroupMessagesUseCase } from "../../application/interfaces/chat/IGetGroupMessagesUseCase";
import { IGroupRepository } from "../../domain/repositories/IGroupRepository";
import { GroupChatEmitter } from "../../shared/events/GroupChatEmitter";
import { IGetDepartmentGroupsForCompanyUseCase } from "../../application/interfaces/chat/IGetDepartmentGroupsForCompanyUseCase";
import { IGetMyDepartmentGroupUseCase } from "../../application/interfaces/chat/IGetMyDepartmentGroupUseCase";

export class GroupChatController {
    constructor(
        private _createGroupUseCase: ICreateGroupUseCase,
        private _sendGroupMessageUseCase: ISendGroupMessageUseCase,
        private _getGroupMessagesUseCase: IGetGroupMessagesUseCase,
        private _groupRepository: IGroupRepository,
        private _getDepartmentGroupsForCompanyUseCase?: IGetDepartmentGroupsForCompanyUseCase,
        private _getMyDepartmentGroupUseCase?: IGetMyDepartmentGroupUseCase
    ) { }

    createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const { name, members } = req.body;
        if (!name || !members || !Array.isArray(members)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: Messages.GROUP_NAME_AND_MEMBERS_REQUIRED
            });
            return;
        }

        const allMembers = members.includes(userId) ? members : [...members, userId];

        const group = await this._createGroupUseCase.execute(name, allMembers);
        res.status(StatusCodes.CREATED).json({
            message: Messages.GROUP_CREATED,
            group
        });
    };

    sendGroupMessage = async (req: AuthRequest, res: Response): Promise<void> => {
        const senderId = req.userId;
        if (!senderId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const { groupId, message, senderName } = req.body;
        if (!groupId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: Messages.GROUP_ID_REQUIRED
            });
            return;
        }

        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: Messages.GROUP_NOT_FOUND });
            return;
        }

        if (!group.members.includes(senderId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: Messages.NOT_GROUP_MEMBER
            });
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

        const savedMessage = await this._sendGroupMessageUseCase.execute(
            groupId,
            senderId,
            message || "",
            messageType,
            fileUrl,
            fileName,
            fileSize,
            mimeType
        );

        GroupChatEmitter.emitMessage(
            groupId,
            senderId,
            message || "",
            savedMessage.createdAt.toISOString(),
            senderName || "Unknown User",
            messageType,
            fileUrl,
            fileName,
            fileSize,
            mimeType
        );

        res.status(StatusCodes.OK).json({
            message: Messages.GROUP_MESSAGE_SENT,
            savedMessage
        });
    };

    getGroupMessages = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const { groupId } = req.params;
        const { limit, after } = req.query;

        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: Messages.GROUP_NOT_FOUND });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: Messages.NOT_GROUP_MEMBER
            });
            return;
        }

        const messages = await this._getGroupMessagesUseCase.execute(
            groupId,
            limit ? parseInt(limit as string) : undefined,
            after ? new Date(after as string) : undefined
        );

        res.status(StatusCodes.OK).json(messages);
    };

    getGroupsForUser = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const groups = await this._groupRepository.getGroupsForUser(userId);
        res.status(StatusCodes.OK).json(groups);
    };

    addMemberToGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const { groupId } = req.params;
        const { newMemberId, newMemberName } = req.body;

        if (!newMemberId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: Messages.NEW_MEMBER_ID_REQUIRED
            });
            return;
        }

        
        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: Messages.GROUP_NOT_FOUND });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: Messages.NOT_GROUP_MEMBER
            });
            return;
        }

        const updatedGroup = await this._groupRepository.addMember(groupId, newMemberId);


        GroupChatEmitter.emitMemberJoined(
            groupId,
            newMemberId,
            newMemberName || "New Member"
        );

        res.status(StatusCodes.OK).json({
            message: Messages.MEMBER_ADDED_TO_GROUP,
            group: updatedGroup
        });
    };

    removeMemberFromGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        const { groupId, memberId } = req.params;
        const { memberName } = req.body;

        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: Messages.GROUP_NOT_FOUND });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: Messages.NOT_GROUP_MEMBER
            });
            return;
        }

        const updatedGroup = await this._groupRepository.removeMember(groupId, memberId);

        GroupChatEmitter.emitMemberLeft(
            groupId,
            memberId,
            memberName || "Member"
        );

        res.status(StatusCodes.OK).json({
            message: Messages.MEMBER_REMOVED_FROM_GROUP,
            group: updatedGroup
        });
    };

    getDepartmentGroupsForCompany = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        if (!this._getDepartmentGroupsForCompanyUseCase) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: Messages.DEPARTMENT_GROUP_UNAVAILABLE
            });
            return;
        }

        const groups = await this._getDepartmentGroupsForCompanyUseCase.execute(userId);
        res.status(StatusCodes.OK).json(groups);
    };

    getMyDepartmentGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        const userRole = req.role as "manager" | "employee";

        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.USER_NOT_AUTHENTICATED });
            return;
        }

        if (!userRole || (userRole !== "manager" && userRole !== "employee")) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: Messages.ENDPOINT_MANAGERS_EMPLOYEES_ONLY
            });
            return;
        }

        if (!this._getMyDepartmentGroupUseCase) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: Messages.DEPARTMENT_GROUP_UNAVAILABLE
            });
            return;
        }

        const group = await this._getMyDepartmentGroupUseCase.execute(userId, userRole);
        res.status(StatusCodes.OK).json(group);
    };
}
