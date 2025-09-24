export interface CreateUserStoryDTO {
  title: string;
  description: string;
  projectId: string;                      
  createdBy: string;                       
  priority?: "Low" | "Medium" | "High";    
  status?: "To Do" | "In Progress" | "Done"; 
  storyPoints: number;                     
  capacity: number;                        
  assignedTo?: string;     
  sprintId?:string                
}
