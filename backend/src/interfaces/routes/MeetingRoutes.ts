import express from 'express'
import { meetingDI } from '../../di/MeetingDI';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { CreateMeetingSchema, GenerateTokenSchema } from '../../application/validators/OtherValidators';


const meetingRouter = express.Router();
const controller = meetingDI()

meetingRouter.post('/', authMiddleware(["manager"]), validateRequest(CreateMeetingSchema), asyncHandler(controller.createMeeting))
meetingRouter.post("/token", authMiddleware(["manager", "employee"]), validateRequest(GenerateTokenSchema), asyncHandler(controller.genarateToken));
meetingRouter.post('/join/:roomId', authMiddleware(["manager", "employee"]), asyncHandler(controller.joinMeeting));
meetingRouter.post('/close/:roomId', asyncHandler(controller.closeMeeting));
meetingRouter.get('/', authMiddleware(["manager"]), asyncHandler(controller.getMeetingsByCreator))
meetingRouter.get('/meetings', authMiddleware(["employee"]), asyncHandler(controller.getMeetingForEmployee))


export default meetingRouter
