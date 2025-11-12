import express from 'express'
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';


const chatRouter=express.Router();
const chatController=new ChatController()

chatRouter.post('/send',authMiddleware(['manager','company','employee']),asyncHandler(chatController.sentMessage))


export default chatRouter