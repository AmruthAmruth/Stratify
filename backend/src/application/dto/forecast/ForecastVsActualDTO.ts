export interface ForecastVsActualDTO {
    employeeId: string;
    employeeName: string;
    projectId: string;
    projectName: string;
    forecastHours: number;
    actualHours: number;
    variance: number;
    variancePercent: number;
    leaveHours: number;
    availableHours: number;
    utilizationPercent: number;
    period: {
        startDate: Date;
        endDate: Date;
    };
}
