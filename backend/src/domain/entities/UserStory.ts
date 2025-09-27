export class UserStory {
  constructor(
    public id: string | undefined,
    public title: string,
    public description: string,
    public projectId: string,
    public backlogId: string,                
    public createdBy: string,
    public priority: "Low" | "Medium" | "High" = "Medium",
    public status: "Backlog" | "To Do" | "In Progress" | "Done" = "Backlog",
    public storyPoints: number,              
    public sprintId?: string,                
    public assignedToIds?: string[],          
    public acceptanceCriteria?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public userStoryIds: string[] = [] 
  ) {}
}