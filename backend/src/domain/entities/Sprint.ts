export class Sprint {
  constructor(
    public readonly id: string | undefined,
    public name: string,
    public goal: string,
    public startDate: Date,
    public endDate: Date,
    public projectId: string,
    public status: "Planned" | "Active" | "Completed" = "Planned",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  activate() {
    this.status = "Active";
    this.updatedAt = new Date();
  }

  complete() {
    this.status = "Completed";
    this.updatedAt = new Date();
  }
}
