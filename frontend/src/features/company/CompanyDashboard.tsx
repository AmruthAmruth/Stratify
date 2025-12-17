import React, { useEffect, useState } from 'react';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import ReusableChart from '@/shared/components/Chart/ReusableChart';
import { getCompanyAnalytics } from '@/services/company';
import { BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  totalManagers: number;
  activeDepartments: number;
  activeProjects: number;
  completedProjects: number;
  pendingLeaves: number;
  totalMeetings: number;
}

interface ChartData {
  labels: string[];
  data: number[];
}

interface CompanyAnalytics {
  stats: DashboardStats;
  chartData: {
    departmentDistribution: ChartData;
    projectStatus: ChartData;
    employeeByDepartment: ChartData;
    leaveStatus: ChartData;
    meetingTypes: ChartData;
    companyActivity: ChartData;
  };
}

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getCompanyAnalytics();
      console.log('Company Analytics Response:', data);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching company analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fbfbfb]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009063]"></div>
          <p className="mt-4 text-[#3b3b3b] font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fbfbfb]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-[#3b3b3b]/30 mx-auto mb-4" />
          <p className="text-[#3b3b3b] font-medium">No analytics data available</p>
        </div>
      </div>
    );
  }

  const { stats, chartData } = analytics;

  // Helper function to check if chart has data
  const hasChartData = (data: number[]) => {
    return data.length > 0 && data.some(value => value > 0);
  };

  // Empty state component
  const EmptyChartState = ({ message }: { message: string }) => (
    <div className="h-64 flex flex-col items-center justify-center text-[#3b3b3b]/50">
      <BarChart3 className="w-16 h-16 mb-3 opacity-30" />
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">Data will appear once available</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#3b3b3b] mb-2">Company Dashboard</h1>
        <p className="text-[#3b3b3b]/70">Comprehensive overview of your organization's performance and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle="Across all departments"
          trend="up"
          badge={`${stats.totalManagers} Managers`}
        />
        <DashboardCard
          title="Total Managers"
          value={stats.totalManagers}
          subtitle="Department leaders"
          trend="up"
          badge={`${Math.round((stats.activeDepartments / (stats.totalManagers || 1)) * 100)}% Assigned`}
        />
        <DashboardCard
          title="Active Departments"
          value={stats.activeDepartments}
          subtitle="With assigned managers"
          trend="up"
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          subtitle="Currently in progress"
          trend="up"
          badge={`${stats.completedProjects} Completed`}
        />
        <DashboardCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          subtitle="Awaiting approval"
          trend={stats.pendingLeaves > 10 ? "down" : "none"}
          badge={stats.pendingLeaves > 0 ? "Action Required" : "All Clear"}
        />
        <DashboardCard
          title="Total Meetings"
          value={stats.totalMeetings}
          subtitle="Scheduled meetings"
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#3b3b3b] mb-6">Analytics & Insights</h2>

        {/* Row 1 - First 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Department Distribution - Doughnut */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Department Distribution</h3>
            {hasChartData(chartData.departmentDistribution.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="doughnut"
                  labels={chartData.departmentDistribution.labels}
                  data={chartData.departmentDistribution.data}
                  backgroundColors={['#009063', '#3b3b3b', '#6c5ce7', '#ffd93d', '#ff6b6b', '#74b9ff']}
                />
              </div>
            ) : (
              <EmptyChartState message="No departments with employees yet" />
            )}
          </div>

          {/* Chart 2: Project Status - Pie */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Project Status Distribution</h3>
            {hasChartData(chartData.projectStatus.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="pie"
                  labels={chartData.projectStatus.labels}
                  data={chartData.projectStatus.data}
                  backgroundColors={['#009063', '#3b3b3b', '#dfdcef', '#ff6b6b']}
                />
              </div>
            ) : (
              <EmptyChartState message="No projects available yet" />
            )}
          </div>

          {/* Chart 3: Employee by Department - Bar */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Employees by Department</h3>
            {hasChartData(chartData.employeeByDepartment.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="bar"
                  labels={chartData.employeeByDepartment.labels}
                  data={chartData.employeeByDepartment.data}
                  backgroundColors={['#009063', '#3b3b3b', '#6c5ce7', '#ffd93d', '#ff6b6b', '#74b9ff']}
                />
              </div>
            ) : (
              <EmptyChartState message="No department data yet" />
            )}
          </div>
        </div>

        {/* Row 2 - Next 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Chart 4: Leave Status - Pie */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Leave Request Status</h3>
            {hasChartData(chartData.leaveStatus.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="pie"
                  labels={chartData.leaveStatus.labels}
                  data={chartData.leaveStatus.data}
                  backgroundColors={['#ffd93d', '#009063', '#ff6b6b']}
                />
              </div>
            ) : (
              <EmptyChartState message="No leave requests yet" />
            )}
          </div>

          {/* Chart 5: Meeting Types - Bar */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Meeting Types</h3>
            {hasChartData(chartData.meetingTypes.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="bar"
                  labels={chartData.meetingTypes.labels}
                  data={chartData.meetingTypes.data}
                  backgroundColors={['#009063', '#3b3b3b', '#6c5ce7', '#a29bfe', '#ffd93d']}
                />
              </div>
            ) : (
              <EmptyChartState message="No meetings scheduled yet" />
            )}
          </div>

          {/* Chart 6: Company Activity Timeline - Line */}
          <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Company Activity Timeline</h3>
            {hasChartData(chartData.companyActivity.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="line"
                  labels={chartData.companyActivity.labels}
                  data={chartData.companyActivity.data}
                  backgroundColors={['#009063']}
                />
              </div>
            ) : (
              <EmptyChartState message="No activity data yet" />
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-white border border-[#dfdcef] rounded-xl">
        <p className="text-sm text-[#3b3b3b]/70 text-center">
          Dashboard data is updated in real-time. Last refreshed: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CompanyDashboard;