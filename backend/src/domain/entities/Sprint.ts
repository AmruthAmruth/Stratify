export class Sprint {
  constructor(
    public id: string | undefined,
    public name: string,
     public description: string,  
    public projectId: string,
    public startDate: Date,
    public endDate: Date,
    public status: "Planned" | "Active" | "Completed" = "Planned",
    public teamCapacity: number,           
    public totalStoryPoints: number = 0,     
    public createdBy: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
