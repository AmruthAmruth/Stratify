import { GroupMessage } from "../entities/GroupMessage";



export interface IGroupMessageRepository {
  saveMessage(groupId: string, senderId: string, message: string): Promise<GroupMessage>;
  getMessages(groupId: string, limit?: number, after?: Date): Promise<GroupMessage[]>;
}