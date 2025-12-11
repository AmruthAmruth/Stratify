export interface EmployeeAvailableCapacityDTO {
    employeeId: string;
    name: string;
    position: string;
    totalSprintHours: number;
    leaveHours: number;
    assignedHours: number;
    availableHours: number;
    utilizationPercent: number;
}
