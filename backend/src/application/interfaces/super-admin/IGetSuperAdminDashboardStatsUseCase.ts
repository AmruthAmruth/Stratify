export interface SuperAdminDashboardStatsResponse {
  stats: {
    totalCompanies: number | undefined;
    approvedCompanies: number | undefined;
    pendingCompanies: number | undefined;
    rejectedCompanies: number | undefined;
    activeSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  graphs: {
    companiesByStatus: {
      labels: string[];
      data: number[];
    };
    subscriptionsByPlan: {
      labels: string[];
      data: number[];
    };
    revenueTrend: {
      labels: string[];
      data: number[];
    };
  };
}

export interface IGetSuperAdminDashboardStatsUseCase {
  execute(): Promise<SuperAdminDashboardStatsResponse>;
}
