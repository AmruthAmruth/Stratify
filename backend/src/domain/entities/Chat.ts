export class Chat {
  constructor(
    public id: string,
    public senderId: string,
    public receiverId: string,
    public message: string,
    public isRead: boolean = false,
    public createdAt: Date = new Date(),
    public messageType?: string,
    public fileUrl?: string,
    public fileName?: string,
    public fileSize?: number,
    public mimeType?: string
  ) { }
}
