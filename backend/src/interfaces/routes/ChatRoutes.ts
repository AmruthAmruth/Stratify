import express from 'express';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { ChatDI } from '../../di/ChatDI';
const chatRouter = express.Router();
const controller = ChatDI();


chatRouter.post(
    '/send',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.sentMessage)
);

chatRouter.get(
    '/team',
    authMiddleware(['manager', 'company', 'employee']),
    asyncHandler(controller.getTeamForManager)
);

export default chatRouter;
