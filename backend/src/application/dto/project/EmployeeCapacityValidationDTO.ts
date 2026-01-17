export interface ValidateEmployeeCapacityDTO {
    employeeId: string;
    sprintId: string;
    additionalSize: number;
    excludeIssueId?: string; 
}

export interface EmployeeCapacityValidationResult {
    isValid: boolean;
    employeeName: string;
    totalAvailability: number; 
    currentWorkload: number; 
    additionalSize: number; 
    remainingCapacity: number; 
    errorMessage?: string;
}
