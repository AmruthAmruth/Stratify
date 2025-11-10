import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { IGetMeetingsByCreatorUseCase } from "../../interfaces/meeting/IGetMeetingsByCreatorUseCase";




export class GetMeetingsByCreatorUseCase implements IGetMeetingsByCreatorUseCase{
    constructor(
            private _meetingRepo:IMeetingRepository
    ){}

    async execute(creatorId: string): Promise<Meeting[]> {
        const meetings= await this._meetingRepo.findMeetingByCreatorId(creatorId)
        return meetings
    }
}