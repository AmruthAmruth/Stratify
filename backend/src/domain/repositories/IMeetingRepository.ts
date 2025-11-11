import { Meeting } from "../entities/Meeting";

export interface IMeetingRepository {
  create(meeting: Omit<Meeting, "id" | "createdAt">): Promise<Meeting>;
  findByRoomId(roomId: string): Promise<Meeting | null>;
  close(roomId: string): Promise<void>;
  findMeetingByCreatorId(creatorId:string):Promise<Meeting[]>
  findByTitle(title:string):Promise<boolean>
}