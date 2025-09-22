
export interface CreateProjectDTO {
  name: string;                     
  key: string;                       
  description?: string;               
  startDate?: Date;                   
  endDate?: Date;                    
  companyId: string;   
  departmentId:string;               
  assignedEmployeeIds?: string[];    
  status?: "Planned" | "Active" | "Completed" | "Archived"; 
}