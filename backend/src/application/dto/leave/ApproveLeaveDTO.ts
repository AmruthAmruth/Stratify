    export interface ApproveLeaveDTO {
    leaveId: string;                    
     status: "Approved" | "Rejected";
    reason?:string                  
    }