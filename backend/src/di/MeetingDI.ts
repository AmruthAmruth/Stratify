import { CloseMeetingUseCase } from "../application/use-cases/meeting/CloseMeetingUseCase";
import { CreateMeetingUseCase } from "../application/use-cases/meeting/CreateMeetingUseCase";
import { GenerateMeetingTokenUseCase } from "../application/use-cases/meeting/GenerateMeetingTokenUseCase";
import { GetMeetingForEmployeeUseCase } from "../application/use-cases/meeting/GetMeetingForEmployeeUseCase";
import { GetMeetingsByCreatorUseCase } from "../application/use-cases/meeting/GetMeetingsByCreatorUseCase";
import { JoinMeetingUseCase } from "../application/use-cases/meeting/JoinMeetingUseCase";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { MeetingRepository } from "../infrastructure/repositories/MeetingRepository";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { ZegoTokenService } from "../infrastructure/services/zego/ZegoTokenService";
import { MeetingController } from "../interfaces/controllers/MeetingController";

export const meetingDI = () => {
  const ZEGO_APP_ID = Number(process.env.ZEGO_APP_ID);
  const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || "";

  const meetingRepository = new MeetingRepository();
  const zegoTokenService = new ZegoTokenService(
    ZEGO_APP_ID,
    ZEGO_SERVER_SECRET
  );

  const employeeRepository=new EmployeeRepository()
  const notificationRepository=new NotificationRepository()
  const managerRepository=new ManagerRepository()


  const createMeetingUseCase = new CreateMeetingUseCase(meetingRepository,notificationRepository,employeeRepository,managerRepository);
  const generateMeetingTokenUseCase = new GenerateMeetingTokenUseCase(
    meetingRepository,
    zegoTokenService
  );

  const joinMeetingUseCase=new JoinMeetingUseCase(meetingRepository);
  const closeMeetinguseCase=new CloseMeetingUseCase(meetingRepository)
  const getMeetingsByCreatorUseCase=new GetMeetingsByCreatorUseCase(meetingRepository)
  const getMeetingForEmployeeUseCase = new GetMeetingForEmployeeUseCase(meetingRepository,employeeRepository)


  return  new MeetingController(
    createMeetingUseCase,
    generateMeetingTokenUseCase,
    joinMeetingUseCase,
    closeMeetinguseCase,
    getMeetingsByCreatorUseCase,
    getMeetingForEmployeeUseCase
  )
};
