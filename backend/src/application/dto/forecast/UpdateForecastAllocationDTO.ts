export interface UpdateForecastAllocationDTO {
    forecastHoursPerWeek?: number;
    startDate?: string;
    endDate?: string | null;
    status?: "Active" | "Completed" | "Cancelled";
    notes?: string;
}
