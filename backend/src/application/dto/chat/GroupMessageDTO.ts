export interface IGroupMessageDTO {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: Date;
}