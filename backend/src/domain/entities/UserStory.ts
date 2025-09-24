export class UserStory {
  constructor(
    public id: string | undefined,
    public title: string,
    public description: string,
    public projectId: string,  
    public createdBy: string, 
    public priority: "Low" | "Medium" | "High" = "Medium",
    public status: "To Do" | "In Progress" | "Done" = "To Do",
    public storyPoints: number,   
    public capacity: number,      
    public assignedTo?: string,   
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
