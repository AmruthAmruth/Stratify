import express from 'express'
import { meetingDI } from '../../di/MeetingDI';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';


const meetingRouter=express.Router();
const controller = meetingDI()

meetingRouter.post('/',authMiddleware(["manager"]),asyncHandler(controller.createMeeting))
meetingRouter.post("/token", authMiddleware(["manager", "employee"]), asyncHandler(controller.genarateToken));
meetingRouter.post('/join/:roomId', asyncHandler(controller.joinMeeting));
meetingRouter.post('/close/:roomId', asyncHandler(controller.closeMeeting));


export default meetingRouter
