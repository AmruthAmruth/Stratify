import { Response } from "express";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { ICreateGroupUseCase } from "../../application/interfaces/chat/ICreateGroupUseCase";
import { ISendGroupMessageUseCase } from "../../application/interfaces/chat/ISendGroupMessageUseCase";
import { IGetGroupMessagesUseCase } from "../../application/interfaces/chat/IGetGroupMessagesUseCase";
import { IGroupRepository } from "../../domain/repositories/IGroupRepository";
import { GroupChatEmitter } from "../../shared/events/GroupChatEmitter";

export class GroupChatController {
    constructor(
        private _createGroupUseCase: ICreateGroupUseCase,
        private _sendGroupMessageUseCase: ISendGroupMessageUseCase,
        private _getGroupMessagesUseCase: IGetGroupMessagesUseCase,
        private _groupRepository: IGroupRepository
    ) { }

    createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { name, members } = req.body;
        if (!name || !members || !Array.isArray(members)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "name and members array are required"
            });
            return;
        }

        // Add creator to members if not already included
        const allMembers = members.includes(userId) ? members : [...members, userId];

        const group = await this._createGroupUseCase.execute(name, allMembers);
        res.status(StatusCodes.CREATED).json({
            message: "Group created successfully",
            group
        });
    };

    sendGroupMessage = async (req: AuthRequest, res: Response): Promise<void> => {
        const senderId = req.userId;
        if (!senderId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { groupId, message, senderName } = req.body;
        if (!groupId || !message) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "groupId and message are required"
            });
            return;
        }

        // Verify user is a member of the group
        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Group not found" });
            return;
        }

        if (!group.members.includes(senderId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not a member of this group"
            });
            return;
        }

        const savedMessage = await this._sendGroupMessageUseCase.execute(
            groupId,
            senderId,
            message
        );

        // Emit to all group members via socket with sender name
        GroupChatEmitter.emitMessage(
            groupId,
            senderId,
            message,
            savedMessage.createdAt.toISOString(),
            senderName || "Unknown User"
        );

        res.status(StatusCodes.OK).json({
            message: "Group message sent successfully",
            savedMessage
        });
    };

    getGroupMessages = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { groupId } = req.params;
        const { limit, after } = req.query;

        // Verify user is a member of the group
        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Group not found" });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not a member of this group"
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
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const groups = await this._groupRepository.getGroupsForUser(userId);
        res.status(StatusCodes.OK).json(groups);
    };

    addMemberToGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { groupId } = req.params;
        const { newMemberId, newMemberName } = req.body;

        if (!newMemberId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "newMemberId is required"
            });
            return;
        }

        // Verify user is a member of the group
        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Group not found" });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not a member of this group"
            });
            return;
        }

        const updatedGroup = await this._groupRepository.addMember(groupId, newMemberId);

        // Emit member joined event
        GroupChatEmitter.emitMemberJoined(
            groupId,
            newMemberId,
            newMemberName || "New Member"
        );

        res.status(StatusCodes.OK).json({
            message: "Member added successfully",
            group: updatedGroup
        });
    };

    removeMemberFromGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { groupId, memberId } = req.params;
        const { memberName } = req.body;

        // Verify user is a member of the group
        const group = await this._groupRepository.findById(groupId);
        if (!group) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Group not found" });
            return;
        }

        if (!group.members.includes(userId)) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not a member of this group"
            });
            return;
        }

        const updatedGroup = await this._groupRepository.removeMember(groupId, memberId);

        // Emit member left event
        GroupChatEmitter.emitMemberLeft(
            groupId,
            memberId,
            memberName || "Member"
        );

        res.status(StatusCodes.OK).json({
            message: "Member removed successfully",
            group: updatedGroup
        });
    };
}
