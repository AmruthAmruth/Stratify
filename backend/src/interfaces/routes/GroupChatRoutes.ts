import express from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { GroupChatDI } from "../../di/GroupChatDI";
import { chatMediaUpload } from "../../infrastructure/services/CloudinaryService";

const groupChatRouter = express.Router();
const controller = GroupChatDI();

// Create a new group
groupChatRouter.post(
    "/create",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.createGroup)
);

// Send a message to a group
groupChatRouter.post(
    "/send",
    authMiddleware(["manager", "company", "employee"]),
    chatMediaUpload.single('file'),
    asyncHandler(controller.sendGroupMessage)
);

// Get messages for a specific group
groupChatRouter.get(
    "/:groupId/messages",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.getGroupMessages)
);

// Get all groups for the authenticated user
groupChatRouter.get(
    "/my-groups",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.getGroupsForUser)
);

// Add a member to a group
groupChatRouter.post(
    "/:groupId/members",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.addMemberToGroup)
);

// Remove a member from a group
groupChatRouter.delete(
    "/:groupId/members/:memberId",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.removeMemberFromGroup)
);

export default groupChatRouter;
