import express from 'express'
import { meetingDI } from '../../di/MeetingDI';
import { authMiddleware } from '../middleware/AuthMiddleware';


const meetingRouter=express.Router();
const controller = meetingDI()

meetingRouter.post('/',authMiddleware(["manager"]),controller.createMeeting)
meetingRouter.post("/token", authMiddleware(["manager", "employee"]), controller.generateToken);


export default meetingRouter
