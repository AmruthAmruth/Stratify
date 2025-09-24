export interface CreateTaskDTO {
  userStoryId: string;                  
  title: string;                        
  description?: string;                 
  status?: "To Do" | "In Progress" | "Done";  
  assignedToId?: string;               
}
