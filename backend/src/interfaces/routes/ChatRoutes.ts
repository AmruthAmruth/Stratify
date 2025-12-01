import express from 'express';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { ChatDI } from '../../di/ChatDI';
import { chatMediaUpload } from '../../infrastructure/services/CloudinaryService';

const chatRouter = express.Router();
const controller = ChatDI();


chatRouter.post(
    '/send',
    authMiddleware(['manager', 'company', 'employee']),
    chatMediaUpload.single('file'),
    asyncHandler(controller.sentMessage)
);

chatRouter.get(
    '/team',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.getTeamForManager)
);

chatRouter.get('/history/:receiverId', authMiddleware(["manager", "employee"]), asyncHandler(controller.getChatHistory))

chatRouter.put(
    '/mark-read/:senderId',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.markMessagesAsRead)
);

chatRouter.get(
    '/unread-counts',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.getUnreadCounts)
);

export default chatRouter;
