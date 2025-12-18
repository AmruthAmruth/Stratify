export interface ForecastAllocationResponseDTO {
    id: string;
    employeeId: string;
    employeeName?: string;
    employeePosition?: string;
    projectId: string;
    projectName?: string;
    projectKey?: string;
    forecastHoursPerWeek: number;
    startDate: Date;
    endDate: Date | null;
    status: "Active" | "Completed" | "Cancelled";
    notes?: string;
    totalForecastHours?: number;
    weeksInPeriod?: number;
    createdBy: string;
    createdByModel: "Company" | "Manager";
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}
