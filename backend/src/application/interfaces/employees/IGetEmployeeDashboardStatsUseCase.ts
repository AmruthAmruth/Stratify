export interface EmployeeDashboardStatsResponse {
  stats: {
    totalAssigned: number;
    pendingIssues: number;
    completedIssues: number;
  };
  graphs: {
    issuesByPriority: {
      labels: string[];
      data: number[];
    };
    issuesByStatus: {
      labels: string[];
      data: number[];
    };
    issuesByType: {
      labels: string[];
      data: number[];
    };
  };
}

export interface IGetEmployeeDashboardStatsUseCase {
  execute(employeeId: string): Promise<EmployeeDashboardStatsResponse>;
}
