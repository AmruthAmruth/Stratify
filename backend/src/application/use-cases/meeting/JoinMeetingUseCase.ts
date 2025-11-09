import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { IJoinMeetingUseCase } from "../../interfaces/meeting/IJoinMeetingUseCase";


export class JoinMeetingUseCase implements IJoinMeetingUseCase{
    constructor(
            private _meetingRepository:IMeetingRepository
    ){}

    async execute(roomId: string): Promise<Meeting> {
        const meeting= await this._meetingRepository.findByRoomId(roomId);
        if(!meeting){
            throw new AppError("Meeting is not found",404)
        }
        if(meeting.status==="closed"){
            throw new AppError("Meeting is Closed",500)
        }

        return meeting
    }
}