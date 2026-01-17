export interface EmployeeCapacityDTO {
    employeeId: string;
    name: string;
    position: string;
    totalHours: number;
    leaveHours: number;
    availableHours: number;
    assignedHours: number; // Hours from assigned issues
    remainingHours: number; // availableHours - assignedHours
    utilizationPercent: number;
    workloadPercent: number; // (assignedHours / availableHours) * 100
    leaves?: Array<{
        startDate: Date;
        endDate: Date;
        type: string;
    }>;
}

export interface SprintCapacityDTO {
    sprintId: string;
    sprintName: string;
    startDate: Date;
    endDate: Date;
    totalWorkingDays: number;
    employees: EmployeeCapacityDTO[];
    teamSummary: {
        totalCapacity: number;
        availableCapacity: number;
        leaveLoss: number;
        availabilityPercent: number;
    };
}
