export interface EmployeeCapacityDTO {
    employeeId: string;
    name: string;
    position: string;
    totalHours: number;
    leaveHours: number;
    availableHours: number;
    utilizationPercent: number;
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
