export interface LeaveCountsDTO {
  Casual: number;
  Sick: number;
  Earned: number;
}

export interface LeaveDTO {
  id?: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: "Casual" | "Sick" | "Earned" | "Other";
  status?: "Pending" | "Approved" | "Rejected";
  reason?: string;
  rejectedReason?: string;
}

export interface EmployeeLeaveDTO {
  leaveCounts: LeaveCountsDTO;
  leaves: LeaveDTO[];
}
