export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public companyId: string,
    public createdBy: string, 
    public managerId?: string, 
    public status: "Planned" | "Active" | "Completed" | "Archived" = "Planned",
    public startDate?: Date,
    public endDate?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  
  assignManager(managerId: string) {
    this.managerId = managerId;
    this.updatedAt = new Date();
  }

  
  updateStatus(status: "Planned" | "Active" | "Completed" | "Archived") {
    this.status = status;
    this.updatedAt = new Date();
  }
}
