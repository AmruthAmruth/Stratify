import React, { useEffect, useState } from 'react';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import ReusableChart from '@/shared/components/Chart/ReusableChart';
import { getSuperAdminDashboardStats } from '@/services/plans';
import { BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalCompanies: number;
  approvedCompanies: number;
  pendingCompanies: number;
  rejectedCompanies: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface ChartData {
  companiesByStatus: { labels: string[]; data: number[] };
  subscriptionsByPlan: { labels: string[]; data: number[] };
  revenueTrend: { labels: string[]; data: number[] };
}

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    approvedCompanies: 0,
    pendingCompanies: 0,
    rejectedCompanies: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    companiesByStatus: { labels: [], data: [] },
    subscriptionsByPlan: { labels: [], data: [] },
    revenueTrend: { labels: [], data: [] },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getSuperAdminDashboardStats();

      if (data.stats) {
        setStats(data.stats);
      }

      if (data.graphs) {
        setChartData(data.graphs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const hasChartData = (data: number[]) => {
    return data && data.length > 0 && data.some(value => value > 0);
  };

  const EmptyChartState = ({ message }: { message: string }) => (
    <div className="h-64 flex flex-col items-center justify-center text-text/50">
      <BarChart3 className="w-16 h-16 mb-3 opacity-30" />
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">Data will appear once available</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-2">Super Admin Dashboard</h1>
        <p className="text-text/70">Overview of platform performance and companies</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <DashboardCard
          title="Total Companies"
          value={stats.totalCompanies}
          subtitle="Registered companies"
          trend="up"
        />
        <DashboardCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          subtitle="Currently active plans"
          trend="up"
          badge={stats.activeSubscriptions > 0 ? "Healthy" : "Low"}
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          subtitle="Lifetime revenue"
          trend="up"
        />
        <DashboardCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue}`}
          subtitle="Revenue this month"
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-6">Analytics & Insights</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Companies by Status */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Companies by Status</h3>
            {hasChartData(chartData.companiesByStatus.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="doughnut"
                  labels={chartData.companiesByStatus.labels}
                  data={chartData.companiesByStatus.data}
                  backgroundColors={['#009063', '#ffd93d', '#ff6b6b']}
                />
              </div>
            ) : (
              <EmptyChartState message="No company data available" />
            )}
          </div>

          {/* Chart 2: Subscriptions by Plan */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Subscriptions by Plan</h3>
            {hasChartData(chartData.subscriptionsByPlan.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="pie"
                  labels={chartData.subscriptionsByPlan.labels}
                  data={chartData.subscriptionsByPlan.data}
                  backgroundColors={['#6c5ce7', '#0984e3', '#00b894', '#fdcb6e']}
                />
              </div>
            ) : (
              <EmptyChartState message="No subscription data available" />
            )}
          </div>

          {/* Chart 3: Revenue Trend */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Revenue Trend</h3>
            {hasChartData(chartData.revenueTrend.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="line"
                  labels={chartData.revenueTrend.labels}
                  data={chartData.revenueTrend.data}
                  backgroundColors={['#009063']}
                />
              </div>
            ) : (
              <EmptyChartState message="No revenue data available" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white border border-accent rounded-xl">
        <p className="text-sm text-text/70 text-center">
          Dashboard data is updated in real-time. Last refreshed: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
