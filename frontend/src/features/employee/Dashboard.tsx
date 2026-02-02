import React, { useEffect, useState } from 'react';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import ReusableChart from '@/shared/components/Chart/ReusableChart';
import { getEmployeeDashboardStats } from '@/services/employee';
import { BarChart3 } from 'lucide-react';
import type { EmployeeDashboardStats, EmployeeChartData } from '@/types/types';

const EmployeeDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<EmployeeDashboardStats>({
        totalAssigned: 0,
        pendingIssues: 0,
        completedIssues: 0,
    });

    const [chartData, setChartData] = useState<EmployeeChartData>({
        issuesByPriority: { labels: [], data: [] },
        issuesByStatus: { labels: [], data: [] },
        issuesByType: { labels: [], data: [] },
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await getEmployeeDashboardStats();

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
                <h1 className="text-4xl font-bold text-text mb-2">My Dashboard</h1>
                <p className="text-text/70">Overview of your assigned tasks and performance</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <DashboardCard
                    title="Total Assigned"
                    value={stats.totalAssigned}
                    subtitle="Total issues assigned to you"
                    trend="none"
                />
                <DashboardCard
                    title="Pending Issues"
                    value={stats.pendingIssues}
                    subtitle="Issues to be completed"
                    trend={stats.pendingIssues > 5 ? "up" : "none"}
                    badge={stats.pendingIssues > 0 ? "Action Required" : "All Clear"}
                />
                <DashboardCard
                    title="Completed Issues"
                    value={stats.completedIssues}
                    subtitle="Successfully delivered"
                    trend="up"
                    badge={`${Math.round((stats.completedIssues / (stats.totalAssigned || 1)) * 100)}%`}
                />
            </div>

            {/* Charts Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-6">Analytics & Insights</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Chart 1: Issues by Priority */}
                    <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-semibold text-text mb-4">Issues by Priority</h3>
                        {hasChartData(chartData.issuesByPriority.data) ? (
                            <div className="h-64 w-full flex items-center justify-center">
                                <ReusableChart
                                    type="doughnut"
                                    labels={chartData.issuesByPriority.labels}
                                    data={chartData.issuesByPriority.data}
                                    backgroundColors={['#ff6b6b', '#ffd93d', '#009063', '#dfdcef']}
                                />
                            </div>
                        ) : (
                            <EmptyChartState message="No issues assigned yet" />
                        )}
                    </div>

                    {/* Chart 2: Issues by Status */}
                    <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-semibold text-text mb-4">Issues by Status</h3>
                        {hasChartData(chartData.issuesByStatus.data) ? (
                            <div className="h-64 w-full">
                                <ReusableChart
                                    type="bar"
                                    labels={chartData.issuesByStatus.labels}
                                    data={chartData.issuesByStatus.data}
                                    backgroundColors={['#74b9ff', '#ffd93d', '#a29bfe', '#009063']}
                                />
                            </div>
                        ) : (
                            <EmptyChartState message="No issues assigned yet" />
                        )}
                    </div>

                    {/* Chart 3: Issues by Type */}
                    <div className="bg-surface border border-accent rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-semibold text-text mb-4">Issues by Type</h3>
                        {hasChartData(chartData.issuesByType.data) ? (
                            <div className="h-64 w-full flex items-center justify-center">
                                <ReusableChart
                                    type="pie"
                                    labels={chartData.issuesByType.labels}
                                    data={chartData.issuesByType.data}
                                    backgroundColors={['#6c5ce7', '#009063', '#ffd93d', '#ff6b6b']}
                                />
                            </div>
                        ) : (
                            <EmptyChartState message="No issues assigned yet" />
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-surface border border-accent rounded-xl">
                <p className="text-sm text-text/70 text-center">
                    Dashboard data is updated in real-time. Last refreshed: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
