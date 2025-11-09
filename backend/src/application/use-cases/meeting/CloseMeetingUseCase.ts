import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { ICloseMeetingUseCase } from "../../interfaces/meeting/ICloseMeetingUseCase";




export class CloseMeetingUseCase implements ICloseMeetingUseCase{
    constructor(
            private _meetingRepo:IMeetingRepository
    ){}

    async execute(roomId: string): Promise<void> {
        const meeting = await this._meetingRepo.findByRoomId(roomId);
        if(!meeting){
            throw new AppError("Meeting Not Found",404)
        }

        if(meeting.status==="closed"){
            throw new AppError("Meeting is already closed",500)
        }

        await this._meetingRepo.close(roomId)
    }
}