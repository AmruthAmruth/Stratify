import express from "express";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { asyncHandler } from "../middleware/AsyncHandler";
import { GroupChatDI } from "../../di/GroupChatDI";
import { chatMediaUpload } from "../../infrastructure/services/CloudinaryService";

const groupChatRouter = express.Router();
const controller = GroupChatDI();

groupChatRouter.post(
    "/create",
    authMiddleware(["manager", "company", "employee"]), 
    asyncHandler(controller.createGroup)
);
 

groupChatRouter.post(
    "/send",
    authMiddleware(["manager", "company", "employee"]),
    chatMediaUpload.single('file'),
    asyncHandler(controller.sendGroupMessage)
);


groupChatRouter.get(
    "/:groupId/messages",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.getGroupMessages)
);


groupChatRouter.get(
    "/department-groups",
    authMiddleware(["company"]),
    asyncHandler(controller.getDepartmentGroupsForCompany)
);


groupChatRouter.get(
    "/my-department-group",
    authMiddleware(["manager", "employee"]),
    asyncHandler(controller.getMyDepartmentGroup)
);


groupChatRouter.get(
    "/my-groups",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.getGroupsForUser)
);


groupChatRouter.post(
    "/:groupId/members",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.addMemberToGroup)
);


groupChatRouter.delete(
    "/:groupId/members/:memberId",
    authMiddleware(["manager", "company", "employee"]),
    asyncHandler(controller.removeMemberFromGroup)
);

export default groupChatRouter;
