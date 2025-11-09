import { CreateMeetingUseCase } from "../application/use-cases/meeting/CreateMeetingUseCase";
import { GenerateMeetingTokenUseCase } from "../application/use-cases/meeting/GenerateMeetingTokenUseCase";
import { MeetingRepository } from "../infrastructure/repositories/MeetingRepository";
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

  const createMeetingUseCase = new CreateMeetingUseCase(meetingRepository);
  const generateMeetingTokenUseCase = new GenerateMeetingTokenUseCase(
    meetingRepository,
    zegoTokenService
  );

  return  new MeetingController(
    createMeetingUseCase,
    generateMeetingTokenUseCase
  )
};
