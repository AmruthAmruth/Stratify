// application/useCases/meeting/GenerateMeetingTokenUseCase.ts
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { ZegoTokenService } from "../../../infrastructure/services/zego/ZegoTokenService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { IGenerateMeetingTokenUseCase } from "../../interfaces/meeting/IGenerateMeetingTokenUseCase";

export class GenerateMeetingTokenUseCase implements IGenerateMeetingTokenUseCase {
  constructor(
    private readonly _meetingRepo: IMeetingRepository,
    private readonly _zegoTokenService: ZegoTokenService
  ) {}

  async execute(roomId: string, userId: string, userName: string): Promise<string> {
    const meeting = await this._meetingRepo.findByRoomId(roomId);

    if (!meeting) {
      throw new AppError("Meeting not found", StatusCodes.NOT_FOUND);
    }

    return this._zegoTokenService.generate(roomId, userId, userName);
  }
}
