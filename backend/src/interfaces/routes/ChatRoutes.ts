import express from 'express';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { ChatDI } from '../../di/ChatDI';
import { chatMediaUpload } from '../../infrastructure/services/CloudinaryService';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { z } from 'zod';

const SendChatMessageSchema = z.object({
    receiverId: z.string().min(1, "Receiver ID is required"),
    content: z.string().optional(),
}).passthrough();

const chatRouter = express.Router();
const controller = ChatDI();

chatRouter.post(
    '/send',
    authMiddleware(['manager', 'company', 'employee']),
    chatMediaUpload.single('file'),
    validateRequest(SendChatMessageSchema),
    asyncHandler(controller.sentMessage)
);

chatRouter.get(
    '/team',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.getTeamForManager)
);

chatRouter.get('/history/:receiverId', authMiddleware(["manager", "company", "employee"]), asyncHandler(controller.getChatHistory))

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
