export class Task {
  constructor(
    public id: string | undefined,
    public userStoryId: string,
    public title: string,
    public description: string | undefined,
    public status: "To Do" | "In Progress" | "Done" = "To Do",
    public assignedToId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
