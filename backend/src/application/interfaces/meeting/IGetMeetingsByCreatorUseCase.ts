import { Meeting } from "../../../domain/entities/Meeting";

export interface IGetMeetingsByCreatorUseCase{
    execute(creatorId:string):Promise<Meeting[]>
}