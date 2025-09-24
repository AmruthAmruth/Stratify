export interface CreateUserStoryDTO {
  title: string;
  description: string;
  projectId: string;                      
  backlogId: string;                      
  createdBy: string;                       
  priority?: "Low" | "Medium" | "High";    
  status?: "Backlog" | "To Do" | "In Progress" | "Done"; 
  storyPoints: number;                      
  assignedToIds?: string[];                 
  acceptanceCriteria?: string;                      

}