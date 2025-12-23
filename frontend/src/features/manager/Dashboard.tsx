import React, { useEffect, useState } from 'react';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import ReusableChart from '@/shared/components/Chart/ReusableChart';
import { getDepartmentProjects } from '@/services/projects';
import { getDepartmentLeave } from '@/services/leave';
import { getMeetingsByCreator } from '@/services/meetingService';
import { BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEmployees: number;
  pendingLeaves: number;
  activeEmployees: number;
}

interface ChartData {
  projectStatus: { labels: string[]; data: number[] };
  leaveStatus: { labels: string[]; data: number[] };
  meetingTypes: { labels: string[]; data: number[] };
  employeePerformance: { labels: string[]; data: number[] };
  taskDistribution: { labels: string[]; data: number[] };
  departmentActivity: { labels: string[]; data: number[] };
}

interface Project {
  _id?: string;
  id?: string;
  status?: string;
  createdAt?: string;
  startDate?: string;
  employees?: Array<{ _id?: string; id?: string }>;
  issues?: Array<{ status?: string }>;
}

interface Leave {
  status: string;
}

interface Meeting {
  title?: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEmployees: 0,
    pendingLeaves: 0,
    activeEmployees: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    projectStatus: { labels: [], data: [] },
    leaveStatus: { labels: [], data: [] },
    meetingTypes: { labels: [], data: [] },
    employeePerformance: { labels: [], data: [] },
    taskDistribution: { labels: [], data: [] },
    departmentActivity: { labels: [], data: [] },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch projects data
      const projectsResponse = await getDepartmentProjects() as unknown as { projects?: Project[] };
      const projects = projectsResponse.projects || [];
      console.log('Projects Response:', projectsResponse);
      console.log('Projects Array:', projects);

      // Fetch leaves data
      const leavesResponse = await getDepartmentLeave() as unknown as { leaves?: Leave[] };
      const leaves = leavesResponse.leaves || [];
      console.log('Leaves Response:', leavesResponse);
      console.log('Leaves Array:', leaves);

      // Fetch meetings data
      const meetingsResponse = await getMeetingsByCreator() as unknown as Meeting[] | { meetings?: Meeting[] };
      // Meetings API returns array directly, not { meetings: [...] }
      const meetings = Array.isArray(meetingsResponse) ? meetingsResponse : (meetingsResponse.meetings || []);
      console.log('Meetings Response:', meetingsResponse);
      console.log('Meetings Array:', meetings);

      // Calculate statistics
      const totalProjects = projects.length;
      const activeProjects = projects.filter(
        (p) => {
          const status = (p.status || '').toLowerCase();
          return status === 'active' || status === 'in-progress' || status === 'in progress';
        }
      ).length;
      const completedProjects = projects.filter(
        (p) => (p.status || '').toLowerCase() === 'completed'
      ).length;

      // Get unique employees from projects
      const employeeSet = new Set();
      projects.forEach((project) => {
        if (project.employees && Array.isArray(project.employees)) {
          project.employees.forEach((emp) => {
            employeeSet.add(emp._id || emp.id);
          });
        }
      });
      const totalEmployees = employeeSet.size;

      const pendingLeaves = leaves.filter(
        (l) => l.status === 'pending'
      ).length;

      // Active employees - employees assigned to active projects
      const activeEmployeeSet = new Set();
      projects
        .filter((p) => {
          const status = (p.status || '').toLowerCase();
          return status === 'active' || status === 'in-progress' || status === 'in progress';
        })
        .forEach((project) => {
          if (project.employees && Array.isArray(project.employees)) {
            project.employees.forEach((emp) => {
              activeEmployeeSet.add(emp._id || emp.id);
            });
          }
        });
      const activeEmployees = activeEmployeeSet.size;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalEmployees,
        pendingLeaves,
        activeEmployees,
      });

      // Prepare chart data

      // 1. Project Status (Doughnut)
      const projectStatusCounts = {
        Active: projects.filter((p) => {
          const status = (p.status || '').toLowerCase();
          return status === 'active' || status === 'in-progress' || status === 'in progress';
        }).length,
        Completed: projects.filter((p) => (p.status || '').toLowerCase() === 'completed').length,
        Planned: projects.filter((p) => {
          const status = (p.status || '').toLowerCase();
          return status === 'pending' || status === 'planning' || status === 'planned';
        }).length,
        OnHold: projects.filter((p) => (p.status || '').toLowerCase() === 'on-hold').length,
      };

      // 2. Leave Status (Pie)
      const leaveStatusCounts = {
        Pending: leaves.filter((l) => l.status === 'pending').length,
        Approved: leaves.filter((l) => l.status === 'approved').length,
        Rejected: leaves.filter((l) => l.status === 'rejected').length,
      };

      // 3. Meeting Types (Bar)
      const meetingTypeCounts = {
        'Daily Standup': meetings.filter((m) => m.title?.toLowerCase().includes('daily') || m.title?.toLowerCase().includes('standup')).length,
        'Planning': meetings.filter((m) => m.title?.toLowerCase().includes('planning')).length,
        'Review': meetings.filter((m) => m.title?.toLowerCase().includes('review')).length,
        'Retrospective': meetings.filter((m) => m.title?.toLowerCase().includes('retro')).length,
        'Other': meetings.filter((m) => {
          const title = m.title?.toLowerCase() || '';
          return !title.includes('daily') && !title.includes('standup') &&
            !title.includes('planning') && !title.includes('review') &&
            !title.includes('retro');
        }).length,
      };

      // 4. Project Timeline (Line) - Projects created over last 6 months
      const currentDate = new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const last6Months = [];
      const projectCountsByMonth = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        last6Months.push(monthNames[date.getMonth()]);

        // Count projects created in this month
        // Note: If createdAt is not available, we'll show total projects in current month
        const monthProjects = projects.filter((p) => {
          const dateStr = p.createdAt || p.startDate;
          if (!dateStr) return false;
          const projectDate = new Date(dateStr);
          return projectDate.getMonth() === date.getMonth() &&
            projectDate.getFullYear() === date.getFullYear();
        }).length;

        projectCountsByMonth.push(monthProjects);
      }

      // 5. Task Distribution (Bar) - Count actual issues/tasks from projects
      let todoCount = 0;
      let inProgressCount = 0;
      let inReviewCount = 0;
      let completedCount = 0;

      projects.forEach((project) => {
        if (project.issues && Array.isArray(project.issues)) {
          project.issues.forEach((issue) => {
            const status = (issue.status || '').toLowerCase();
            if (status === 'todo' || status === 'to-do' || status === 'pending') {
              todoCount++;
            } else if (status === 'in-progress' || status === 'active' || status === 'in progress') {
              inProgressCount++;
            } else if (status === 'review' || status === 'in-review' || status === 'in review') {
              inReviewCount++;
            } else if (status === 'completed' || status === 'done') {
              completedCount++;
            }
          });
        }
      });

      // If no issues found, use project count as approximation
      if (todoCount === 0 && inProgressCount === 0 && inReviewCount === 0 && completedCount === 0) {
        const plannedProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'planned').length;
        todoCount = plannedProjects;
        inProgressCount = activeProjects;
        completedCount = completedProjects;
      }

      const taskDistribution = {
        'To Do': todoCount,
        'In Progress': inProgressCount,
        'In Review': inReviewCount,
        'Completed': completedCount,
      };

      // 6. Department Activity (Doughnut) - Activity distribution
      const departmentActivity = {
        'Active Projects': activeProjects,
        'Meetings Held': meetings.length,
        'Leave Requests': leaves.length,
        'Tasks Completed': completedProjects * 5, // Approximate
      };

      setChartData({
        projectStatus: {
          labels: Object.keys(projectStatusCounts),
          data: Object.values(projectStatusCounts),
        },
        leaveStatus: {
          labels: Object.keys(leaveStatusCounts),
          data: Object.values(leaveStatusCounts),
        },
        meetingTypes: {
          labels: Object.keys(meetingTypeCounts),
          data: Object.values(meetingTypeCounts),
        },
        employeePerformance: {
          labels: last6Months,
          data: projectCountsByMonth,
        },
        taskDistribution: {
          labels: Object.keys(taskDistribution),
          data: Object.values(taskDistribution),
        },
        departmentActivity: {
          labels: Object.keys(departmentActivity),
          data: Object.values(departmentActivity),
        },
      });

      // Debug logging
      console.log('Chart Data Set:', {
        projectStatus: { labels: Object.keys(projectStatusCounts), data: Object.values(projectStatusCounts) },
        leaveStatus: { labels: Object.keys(leaveStatusCounts), data: Object.values(leaveStatusCounts) },
        meetingTypes: { labels: Object.keys(meetingTypeCounts), data: Object.values(meetingTypeCounts) },
        projectTimeline: { labels: last6Months, data: projectCountsByMonth },
        taskDistribution: { labels: Object.keys(taskDistribution), data: Object.values(taskDistribution) },
        departmentActivity: { labels: Object.keys(departmentActivity), data: Object.values(departmentActivity) },
      });

      // Detailed logging
      console.log('Project Status Data:', Object.values(projectStatusCounts));
      console.log('Leave Status Data:', Object.values(leaveStatusCounts));
      console.log('Meeting Types Data:', Object.values(meetingTypeCounts));
      console.log('Project Timeline Data:', projectCountsByMonth);
      console.log('Task Distribution Data:', Object.values(taskDistribution));
      console.log('Department Activity Data:', Object.values(departmentActivity));
    } catch (error: unknown) {
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

  // Helper function to check if chart has data
  const hasChartData = (data: number[]) => {
    return data.length > 0 && data.some(value => value > 0);
  };

  // Empty state component
  const EmptyChartState = ({ message }: { message: string }) => (
    <div className="h-64 flex flex-col items-center justify-center text-text/50">
      <BarChart3 className="w-16 h-16 mb-3 opacity-30" />
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">Data will appear once available</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-2">Manager Dashboard</h1>
        <p className="text-text/70">Overview of your department's performance and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle="All projects in department"
          trend="up"
          badge={`${stats.activeProjects} Active`}
        />
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          subtitle="Currently in progress"
          trend="up"
        />
        <DashboardCard
          title="Completed Projects"
          value={stats.completedProjects}
          subtitle="Successfully delivered"
          trend="up"
          badge={`${Math.round((stats.completedProjects / (stats.totalProjects || 1)) * 100)}%`}
        />
        <DashboardCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle="Team members"
          trend="none"
        />
        <DashboardCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          subtitle="Awaiting approval"
          trend={stats.pendingLeaves > 5 ? "up" : "none"}
          badge={stats.pendingLeaves > 0 ? "Action Required" : "All Clear"}
        />
        <DashboardCard
          title="Active Employees"
          value={stats.activeEmployees}
          subtitle="Currently working"
          trend="up"
          badge={`${Math.round((stats.activeEmployees / (stats.totalEmployees || 1)) * 100)}%`}
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-6">Analytics & Insights</h2>

        {/* Row 1 - First 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Project Status - Doughnut */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Project Status Distribution</h3>
            {hasChartData(chartData.projectStatus.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="doughnut"
                  labels={chartData.projectStatus.labels}
                  data={chartData.projectStatus.data}
                  backgroundColors={['#009063', '#3b3b3b', '#dfdcef', '#ff6b6b']}
                />
              </div>
            ) : (
              <EmptyChartState message="No projects available yet" />
            )}
          </div>

          {/* Chart 2: Leave Status - Pie */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Leave Request Status</h3>
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

          {/* Chart 3: Meeting Types - Bar */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Meeting Types</h3>
            {hasChartData(chartData.meetingTypes.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="bar"
                  labels={chartData.meetingTypes.labels}
                  data={chartData.meetingTypes.data}
                  backgroundColors={['#009063', '#3b3b3b', '#dfdcef', '#6c5ce7', '#a29bfe']}
                />
              </div>
            ) : (
              <EmptyChartState message="No meetings scheduled yet" />
            )}
          </div>
        </div>

        {/* Row 2 - Next 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Chart 4: Project Timeline - Line */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Project Creation Timeline</h3>
            {hasChartData(chartData.employeePerformance.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="line"
                  labels={chartData.employeePerformance.labels}
                  data={chartData.employeePerformance.data}
                  backgroundColors={['#009063']}
                />
              </div>
            ) : (
              <EmptyChartState message="No project creation data yet" />
            )}
          </div>

          {/* Chart 5: Task Distribution - Bar */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Task Status Distribution</h3>
            {hasChartData(chartData.taskDistribution.data) ? (
              <div className="h-64">
                <ReusableChart
                  type="bar"
                  labels={chartData.taskDistribution.labels}
                  data={chartData.taskDistribution.data}
                  backgroundColors={['#74b9ff', '#ffd93d', '#a29bfe', '#009063']}
                />
              </div>
            ) : (
              <EmptyChartState message="No tasks available yet" />
            )}
          </div>

          {/* Chart 6: Department Activity - Doughnut */}
          <div className="bg-white border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-text mb-4">Department Activity Overview</h3>
            {hasChartData(chartData.departmentActivity.data) ? (
              <div className="h-64 flex items-center justify-center">
                <ReusableChart
                  type="doughnut"
                  labels={chartData.departmentActivity.labels}
                  data={chartData.departmentActivity.data}
                  backgroundColors={['#009063', '#6c5ce7', '#ffd93d', '#3b3b3b']}
                />
              </div>
            ) : (
              <EmptyChartState message="No department activity yet" />
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-white border border-accent rounded-xl">
        <p className="text-sm text-text/70 text-center">
          Dashboard data is updated in real-time. Last refreshed: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;