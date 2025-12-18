export interface WorkloadByPeriod {
    startDate: Date;
    endDate: Date;
    availableHours: number;
    assignedHours: number;
    remainingHours: number;
    utilizationPercent: number;
    sprints: Array<{
        sprintId: string;
        sprintName: string;
        hours: number; 
    }>;
}

export interface AllocationSummary {
    projectId: string;
    projectName: string;
    allocationPercent: number;
    hoursPerWeek: number;
}

export interface EmployeeWorkloadDTO {
    employeeId: string;
    employeeName: string;
    position: string;
    totalAllocatedPercent: number;
    allocations: AllocationSummary[];
    workloadByPeriod: WorkloadByPeriod[];
}
