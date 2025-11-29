import React, { useState } from 'react';
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiCalendar, FiFileText, FiVideo, FiAlertCircle } from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const ReusableChart = ({ type, labels, data, title, backgroundColors = ["#009063", "#dfdcef", "#3b3b3b"] }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || "Dataset",
        data,
        backgroundColor: backgroundColors,
        borderColor: "#3b3b3b",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: "#fbfbfb",
    plugins: {
      tooltip: {
        backgroundColor: "#fbfbfb",
        titleColor: "#3b3b3b",
        bodyColor: "#3b3b3b",
        borderColor: "#dfdcef",
        borderWidth: 1,
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#3b3b3b",
          padding: 15,
          font: {
            size: 11
          }
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#3b3b3b",
      },
    },
    scales: type === "line" || type === "bar" ? {
      x: {
        ticks: {
          color: "#3b3b3b",
        },
        grid: {
          color: "#dfdcef",
        },
      },
      y: {
        ticks: {
          color: "#3b3b3b",
        },
        grid: {
          color: "#dfdcef",
        },
      },
    } : undefined,
  };

  switch (type) {
    case "pie":
      return <Pie data={chartData} options={options} />;
    case "doughnut":
      return <Doughnut data={chartData} options={options} />;
    case "line":
      return <Line data={chartData} options={options} />;
    case "bar":
      return <Bar data={chartData} options={options} />;
    default:
      return null;
  }
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  const statCards = [
    { title: 'Team Members', value: '24', change: '+2 this month', icon: FiUsers, color: '#009063' },
    { title: 'Active Projects', value: '12', change: '3 due this week', icon: FiFileText, color: '#009063' },
    { title: 'Tasks Completed', value: '87%', change: '+5% from last week', icon: FiCheckCircle, color: '#009063' },
    { title: 'Attendance Rate', value: '94%', change: 'Above target', icon: FiClock, color: '#009063' },
  ];

  const recentActivity = [
    { name: 'Sarah Johnson', action: 'Completed "Q4 Report"', time: '5 min ago', status: 'completed' },
    { name: 'Michael Chen', action: 'Requested leave (Dec 15-17)', time: '23 min ago', status: 'pending' },
    { name: 'Emily Rodriguez', action: 'Updated "Marketing Campaign"', time: '1 hr ago', status: 'updated' },
    { name: 'David Kim', action: 'Joined meeting "Sprint Planning"', time: '2 hrs ago', status: 'meeting' },
  ];

  const leaveRequests = [
    { name: 'Alex Turner', type: 'Sick Leave', dates: 'Nov 30 - Dec 1', status: 'pending' },
    { name: 'Jessica Moore', type: 'Vacation', dates: 'Dec 20 - Dec 27', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3b3b3b] mb-2">Manager Dashboard</h1>
          <p className="text-[#3b3b3b]/70">From Chaos to Clarity — Your team at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-[#dfdcef] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#009063]/10 rounded-lg">
                  <stat.icon className="text-2xl" style={{ color: stat.color }} />
                </div>
              </div>
              <h3 className="text-[#3b3b3b]/60 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-[#3b3b3b] mb-2">{stat.value}</p>
              <p className="text-xs text-[#009063]">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team Productivity */}
          <div className="bg-white rounded-lg p-6 border border-[#dfdcef]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#3b3b3b]">Team Productivity</h2>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-[#dfdcef] rounded-lg px-3 py-1 text-[#3b3b3b] bg-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="h-64">
              <ReusableChart
                type="line"
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                data={[65, 78, 82, 75, 88, 70, 45]}
                backgroundColors={['#009063']}
              />
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-lg p-6 border border-[#dfdcef]">
            <h2 className="text-lg font-semibold text-[#3b3b3b] mb-6">Project Status</h2>
            <div className="h-64">
              <ReusableChart
                type="doughnut"
                labels={['Completed', 'In Progress', 'On Hold', 'Planning']}
                data={[5, 4, 1, 2]}
                backgroundColors={['#009063', '#3b3b3b', '#dfdcef', '#009063aa']}
              />
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-lg p-6 border border-[#dfdcef]">
            <h2 className="text-lg font-semibold text-[#3b3b3b] mb-6">Department Performance</h2>
            <div className="h-64">
              <ReusableChart
                type="bar"
                labels={['Engineering', 'Design', 'Marketing', 'Sales', 'Support']}
                data={[92, 88, 85, 90, 87]}
                backgroundColors={['#009063', '#009063', '#009063', '#009063', '#009063']}
              />
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-lg p-6 border border-[#dfdcef]">
            <h2 className="text-lg font-semibold text-[#3b3b3b] mb-6">Task Distribution</h2>
            <div className="h-64">
              <ReusableChart
                type="pie"
                labels={['High Priority', 'Medium Priority', 'Low Priority']}
                data={[12, 28, 15]}
                backgroundColors={['#3b3b3b', '#009063', '#dfdcef']}
              />
            </div>
          </div>
        </div>

        {/* Activity and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-[#dfdcef]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#3b3b3b]">Recent Activity</h2>
              <button className="text-sm text-[#009063] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-[#dfdcef] last:border-0">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-[#009063]' : 
                    activity.status === 'pending' ? 'bg-[#3b3b3b]' : 
                    'bg-[#dfdcef]'
                  }`} />
                  <div className="flex-1">
                    <p className="text-[#3b3b3b] font-medium">{activity.name}</p>
                    <p className="text-sm text-[#3b3b3b]/70">{activity.action}</p>
                    <p className="text-xs text-[#3b3b3b]/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg p-6 border border-[#dfdcef]">
            <div className="flex items-center gap-2 mb-6">
              <FiAlertCircle className="text-[#009063]" />
              <h2 className="text-lg font-semibold text-[#3b3b3b]">Pending Approvals</h2>
            </div>
            <div className="space-y-4">
              {leaveRequests.map((request, index) => (
                <div key={index} className="p-4 bg-[#fbfbfb] rounded-lg border border-[#dfdcef]">
                  <p className="font-medium text-[#3b3b3b] mb-1">{request.name}</p>
                  <p className="text-sm text-[#3b3b3b]/70 mb-1">{request.type}</p>
                  <p className="text-xs text-[#3b3b3b]/50 mb-3">{request.dates}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-[#009063] text-white text-sm rounded hover:bg-[#007a52] transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-[#dfdcef] text-[#3b3b3b] text-sm rounded hover:bg-[#d0cde5] transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-sm text-[#009063] hover:underline flex items-center justify-center gap-2">
                <FiCalendar /> View All Requests
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg p-6 border border-[#dfdcef]">
          <h2 className="text-lg font-semibold text-[#3b3b3b] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 rounded-lg border border-[#dfdcef] hover:bg-[#009063]/5 hover:border-[#009063] transition-all">
              <FiFileText className="text-2xl text-[#009063]" />
              <span className="text-sm font-medium text-[#3b3b3b]">Create Project</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 rounded-lg border border-[#dfdcef] hover:bg-[#009063]/5 hover:border-[#009063] transition-all">
              <FiVideo className="text-2xl text-[#009063]" />
              <span className="text-sm font-medium text-[#3b3b3b]">Start Meeting</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 rounded-lg border border-[#dfdcef] hover:bg-[#009063]/5 hover:border-[#009063] transition-all">
              <FiUsers className="text-2xl text-[#009063]" />
              <span className="text-sm font-medium text-[#3b3b3b]">View Team</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 rounded-lg border border-[#dfdcef] hover:bg-[#009063]/5 hover:border-[#009063] transition-all">
              <FiTrendingUp className="text-2xl text-[#009063]" />
              <span className="text-sm font-medium text-[#3b3b3b]">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;