export interface OvercommittedEmployee {
    employeeId: string;
    name: string;
    requiredHours: number;
    availableHours: number;
    deficit: number;
}

export interface SprintValidationDTO {
    isValid: boolean;
    totalRequiredHours: number;
    totalAvailableHours: number;
    overcommittedEmployees: OvercommittedEmployee[];
    warnings: string[];
}
