export interface TeamAnalytics {
    totalEmployees: number;
    activeEmployees: number;
    employeesOnLeave: number;
    averageExperience: number;
    positionDistribution: { [position: string]: number };
    genderDistribution: { male: number; female: number; other: number };
    projectAllocation: {
        assigned: number;
        unassigned: number;
    };
}

export interface IGetTeamAnalyticsUseCase {
    execute(managerId: string): Promise<TeamAnalytics>;
}
