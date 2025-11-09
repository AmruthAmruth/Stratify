import { Meeting } from "../../../domain/entities/Meeting";


export interface IJoinMeetingUseCase{
    execute(roomId:string):Promise<Meeting>
}