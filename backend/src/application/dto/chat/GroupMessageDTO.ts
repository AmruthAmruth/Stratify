export interface IGroupMessageDTO {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: Date;
}