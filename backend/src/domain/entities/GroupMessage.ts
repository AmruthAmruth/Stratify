export class GroupMessage {
  constructor(
    public id: string,
    public groupId: string,
    public senderId: string,
    public message: string,
    public createdAt: Date = new Date()
  ) {}
}
