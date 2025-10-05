export class SubTask {
  constructor(
    public readonly id: string | undefined,
    public issueId: string,
    public heading: string,
    public description: string,
    public hours: number,
    public status: "To Do" | "In Progress" | "Done" | "Blocked" = "To Do",
    public assignedToId: string | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateStatus(newStatus: "To Do" | "In Progress" | "Done" | "Blocked") {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  assignUser(userId: string) {
    this.assignedToId = userId;
    this.updatedAt = new Date();
  }
}