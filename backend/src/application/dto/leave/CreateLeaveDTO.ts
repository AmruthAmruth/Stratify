export interface CreateLeaveDTO {
  employeeId: string;                    
  startDate: Date;                       
  endDate: Date;                         
  type?: "Casual" | "Sick" | "Earned" | "Other"; 
  reason?: string;                        
}