import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import { ICloseMeetingUseCase } from "../../interfaces/meeting/ICloseMeetingUseCase";




export class CloseMeetingUseCase implements ICloseMeetingUseCase {
    constructor(
        private _meetingRepo: IMeetingRepository
    ) { }

    async execute(roomId: string): Promise<void> {
        const meeting = await this._meetingRepo.findByRoomId(roomId);
        if (!meeting) {
            throw new AppError(Messages.MEETING_NOT_FOUND, StatusCodes.NOT_FOUND)
        }

        if (meeting.status === "closed") {
            throw new AppError(Messages.MEETING_ALREADY_CLOSED, StatusCodes.INTERNAL_SERVER_ERROR)
        }

        await this._meetingRepo.close(roomId)
    }
}