export class Message {
  constructor(
    public id: string | undefined,
    public conversationId: string,
    public senderId: string,
    public content: string,
    public type: "text" | "image" | "file" = "text",
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
