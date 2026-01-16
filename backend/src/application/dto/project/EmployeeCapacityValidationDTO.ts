export interface ValidateEmployeeCapacityDTO {
    employeeId: string;
    sprintId: string;
    additionalSize: number;
    excludeIssueId?: string; // For update scenarios
}

export interface EmployeeCapacityValidationResult {
    isValid: boolean;
    employeeName: string;
    totalAvailability: number; // in days
    currentWorkload: number; // in days
    additionalSize: number; // in days
    remainingCapacity: number; // in days
    errorMessage?: string;
}
