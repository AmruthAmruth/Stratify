export class Chat {
  constructor(
    public id: string,
    public senderId: string,
    public receiverId: string,
    public message: string,
    public createdAt: Date = new Date()
  ) {}
}
