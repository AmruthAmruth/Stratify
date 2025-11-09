import { Meeting } from "../../../domain/entities/Meeting";
import { IMeetingRepository } from "../../../domain/repositories/IMeetingRepository";
import { ICreateMeetingUseCase } from "../../interfaces/meeting/ICreateMeetingUseCase";
import { randomUUID } from "crypto";

export class CreateMeetingUseCase implements ICreateMeetingUseCase{
    constructor(
            private _meetingRepo:IMeetingRepository
    ){}
    async execute(creatorId: string, title: string): Promise<Meeting> {
          const meeting = new Meeting(
                undefined,
                randomUUID(),
                creatorId,
                title,
                "open",
                new Date()
          )

          return await this._meetingRepo.create(meeting)
    }
}