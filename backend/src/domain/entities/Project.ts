export class Project {
  constructor(
    public id: string | undefined,
    public name: string,
    public key: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public status: "Planned" | "Active" | "Completed" | "Archived" = "Planned",
    public departmentId: string,
    public projectLeadId: string,
    public createdBy: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
