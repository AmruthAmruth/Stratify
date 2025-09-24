export interface CreateSprintDTO {
  name: string;            
  projectId: string;       
  startDate: Date;         
  endDate: Date;           
  goal?: string;           
}