import { GroupMessage } from "../entities/GroupMessage";



export interface IGroupMessageRepository {
  saveMessage(
    groupId: string,
    senderId: string,
    message: string,
    messageType?: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string
  ): Promise<GroupMessage>;
  getMessages(groupId: string, limit?: number, after?: Date): Promise<GroupMessage[]>;
}