export interface CreateForecastAllocationDTO {
    employeeId: string;
    projectId: string;
    forecastHoursPerWeek: number;
    startDate: string;
    endDate?: string | null;
    notes?: string;
}
