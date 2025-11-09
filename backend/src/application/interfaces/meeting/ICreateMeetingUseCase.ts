import { Meeting } from "../../../domain/entities/Meeting";

export interface ICreateMeetingUseCase{
    execute(creatorId:string,title:string):Promise<Meeting>
}