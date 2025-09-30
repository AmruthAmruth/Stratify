export interface LeaveCountsDTO {
  totalLeave: number;
  peadingLeave: number;
  approvedLeave: number;
  activeMembers: number;
}


export interface LeaveDTO {
  leaveId:string | undefined;
  employeeName: string;                     
  startDate: Date;                        
  endDate: Date;                          
  type: "Casual" | "Sick" | "Earned" | "Other"; 
  status?: "Pending" | "Approved" | "Rejected"; 
  reason?: string; 
  rejectedReason?:string;                       
}


export interface DepartmentLeaveDTO {
  leaveCounts: LeaveCountsDTO;
  leaves: LeaveDTO[];
}