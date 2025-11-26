import { Meeting } from "../../../domain/entities/Meeting";


export interface IJoinMeetingUseCase {
    execute(roomId: string, userId: string): Promise<Meeting>
}