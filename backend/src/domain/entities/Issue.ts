


export class Issue{
    constructor(
    public readonly id: string | undefined,
    public heading: string,
    public description: string,
    public acceptanceCriteria: string,
    public size: number,
    public estimatedHours: number,
    public type: "User Story" | "Bug",
    public status: "Planned" | "In Progress" | "Done" | "Blocked",
    public priority: "Low" | "Medium" | "High",
    public projectId: string,
    public sprintId?: string | null,
    public assignedTo?: string | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
    ){}


    updateStatus(newStatus: "Planned" | "In Progress" | "Done" | "Blocked") {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

   assignUser(userId: string) {
    this.assignedTo = userId;
    this.updatedAt = new Date();
  }

   moveToSprint(sprintId: string) {
    this.sprintId = sprintId;
    this.updatedAt = new Date();
  }


  
}


