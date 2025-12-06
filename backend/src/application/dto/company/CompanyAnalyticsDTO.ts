export interface CompanyAnalyticsStats {
    totalEmployees: number;
    totalManagers: number;
    activeDepartments: number;
    activeProjects: number;
    completedProjects: number;
    pendingLeaves: number;
    totalMeetings: number;
}

export interface ChartData {
    labels: string[];
    data: number[];
}

export interface CompanyAnalyticsChartData {
    departmentDistribution: ChartData;
    projectStatus: ChartData;
    employeeByDepartment: ChartData;
    leaveStatus: ChartData;
    meetingTypes: ChartData;
    companyActivity: ChartData;
}

export interface CompanyAnalyticsDTO {
    stats: CompanyAnalyticsStats;
    chartData: CompanyAnalyticsChartData;
}
