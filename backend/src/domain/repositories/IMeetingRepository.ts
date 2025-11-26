import { Meeting } from "../entities/Meeting";

export interface IMeetingRepository {
  create(meeting: Omit<Meeting, "id" | "createdAt" | "updatedAt">): Promise<Meeting>;
  findByRoomId(roomId: string): Promise<Meeting | null>;
  close(roomId: string): Promise<void>;
  findMeetingByCreatorId(creatorId: string): Promise<Meeting[]>;
  findByTitle(title: string): Promise<boolean>;
  findByProjectId(projectId: string): Promise<Meeting[]>;
  findByProjectAndDate(projectId: string, date: Date): Promise<Meeting | null>;
}