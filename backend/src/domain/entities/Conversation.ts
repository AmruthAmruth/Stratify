export class Conversation {
  constructor(
    public id: string | undefined,
    public isGroup: boolean = false,
    public name?: string,
    public members: string[] = [],
    public lastMessage?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
