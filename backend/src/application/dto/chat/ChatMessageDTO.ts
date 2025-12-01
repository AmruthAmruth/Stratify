export interface IChatMessageDTO {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    messageType?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    createdAt: Date;
}
