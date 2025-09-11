import React, { useState, useEffect } from "react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import Table from "@/shared/components/Table/Table";
import ReusableChart from "@/shared/components/Chart/ReusableChart";

interface Employee {
  name: string;
  email: string;
  phone: string;
  position: string;
  avatar: string;
  performance: number;
  status: 'Available' | 'Busy' | 'Away';
  joinDate: string;
  skills: string[];
  projects: number;
}

interface Project {
  projectName: string;
  managerName: string;
  status: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  budget: string;
  deadline: string;
  team: number;
  health: 'Good' | 'At Risk' | 'Critical';
}

const DepartmentDetailsPage: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [employeePage, setEmployeePage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const department = {
    name: "Engineering Department",
    description: "Driving innovation through cutting-edge technology solutions and exceptional engineering practices.",
    status: "Active",
    head: {
      name: "Amruth Shyju",
      email: "amruth.shyju@company.com",
      phone: "+91 98765 43210",
      designation: "Head of Engineering",
      avatar: "AS"
    },
    totalProjects: 12,
    totalEmployees: 35,
    activeProjects: 8,
    completedProjects: 4,
    efficiency: 95,
    budget: "$2.5M",
    revenue: "$4.2M",
    satisfaction: 98
  };

  const employees: Employee[] = [
    { 
      name: "Alice Johnson", 
      email: "alice.johnson@company.com", 
      phone: "+91 98765 43211", 
      position: "Senior Full Stack Developer",
      avatar: "AJ",
      performance: 95,
      status: 'Available',
      joinDate: '2022-03-15',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      projects: 3
    },
    { 
      name: "Robert Smith", 
      email: "robert.smith@company.com", 
      phone: "+91 98765 43212", 
      position: "Lead QA Engineer",
      avatar: "RS",
      performance: 92,
      status: 'Busy',
      joinDate: '2021-08-20',
      skills: ['Selenium', 'Jest', 'Cypress', 'Jenkins'],
      projects: 2
    },
    { 
      name: "Sarah Wilson", 
      email: "sarah.wilson@company.com", 
      phone: "+91 98765 43213", 
      position: "Senior UI/UX Designer",
      avatar: "SW",
      performance: 98,
      status: 'Available',
      joinDate: '2020-11-10',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      projects: 4
    },
    { 
      name: "Michael Chen", 
      email: "michael.chen@company.com", 
      phone: "+91 98765 43214", 
      position: "DevOps Architect",
      avatar: "MC",
      performance: 94,
      status: 'Away',
      joinDate: '2019-05-12',
      skills: ['Docker', 'Kubernetes', 'Terraform'],
      projects: 2
    },
    { 
      name: "Emma Rodriguez", 
      email: "emma.rodriguez@company.com", 
      phone: "+91 98765 43215", 
      position: "Technical Project Manager",
      avatar: "ER",
      performance: 96,
      status: 'Available',
      joinDate: '2021-01-18',
      skills: ['Agile', 'Scrum', 'JIRA'],
      projects: 5
    },
    { 
      name: "David Thompson", 
      email: "david.thompson@company.com", 
      phone: "+91 98765 43216", 
      position: "Backend Engineer",
      avatar: "DT",
      performance: 90,
      status: 'Busy',
      joinDate: '2023-02-28',
      skills: ['Java', 'Spring', 'MongoDB'],
      projects: 2
    }
  ];

  const projects: Project[] = [
    { 
      projectName: "Next-Gen ERP Platform", 
      managerName: "Amruth Shyju", 
      status: "In Progress",
      progress: 75,
      priority: 'High',
      budget: '$850K',
      deadline: '2024-12-15',
      team: 8,
      health: 'Good'
    },
    { 
      projectName: "Mobile Commerce App", 
      managerName: "Alice Johnson", 
      status: "Completed",
      progress: 100,
      priority: 'Medium',
      budget: '$420K',
      deadline: '2024-08-30',
      team: 5,
      health: 'Good'
    },
    { 
      projectName: "AI-Powered Analytics", 
      managerName: "Robert Smith", 
      status: "In Progress",
      progress: 60,
      priority: 'High',
      budget: '$650K',
      deadline: '2024-11-20',
      team: 6,
      health: 'At Risk'
    },
    { 
      projectName: "Customer Portal 2.0", 
      managerName: "Sarah Wilson", 
      status: "Planning",
      progress: 25,
      priority: 'Medium',
      budget: '$320K',
      deadline: '2025-02-28',
      team: 4,
      health: 'Good'
    },
    { 
      projectName: "Cloud Infrastructure", 
      managerName: "Michael Chen", 
      status: "In Progress",
      progress: 85,
      priority: 'High',
      budget: '$480K',
      deadline: '2024-10-15',
      team: 3,
      health: 'Good'
    },
    { 
      projectName: "Security Enhancement", 
      managerName: "Emma Rodriguez", 
      status: "Review",
      progress: 95,
      priority: 'High',
      budget: '$280K',
      deadline: '2024-09-30',
      team: 4,
      health: 'Critical'
    }
  ];

  const pageSize = 4;

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || emp.status.toLowerCase() === filterStatus)
  );

  const paginatedEmployees = filteredEmployees.slice(
    (employeePage - 1) * pageSize,
    employeePage * pageSize
  );
  const totalEmployeePages = Math.ceil(filteredEmployees.length / pageSize);

  const paginatedProjects = projects.slice(
    (projectPage - 1) * pageSize,
    projectPage * pageSize
  );
  const totalProjectPages = Math.ceil(projects.length / pageSize);

  const getStatusStyle = (status: string) => {
    const styles = {
      'Active': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200',
      'Completed': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200',
      'In Progress': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200',
      'Planning': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200',
      'Review': 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-200',
      'Available': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Busy': 'bg-red-50 text-red-700 border border-red-200',
      'Away': 'bg-gray-50 text-gray-700 border border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityStyle = (priority: string) => {
    const styles = {
      'High': 'bg-red-50 text-red-700 border-l-4 border-red-400',
      'Medium': 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400',
      'Low': 'bg-green-50 text-green-700 border-l-4 border-green-400'
    };
    return styles[priority] || 'bg-gray-50 text-gray-700';
  };

  const getHealthStyle = (health: string) => {
    const styles = {
      'Good': 'text-green-600',
      'At Risk': 'text-yellow-600',
      'Critical': 'text-red-600'
    };
    return styles[health] || 'text-gray-600';
  };

  // Enhanced project table columns with your Table component
  const projectColumns = [
    { 
      key: "projectName", 
      label: "Project Name",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{value}</span>
          <span className="text-xs text-gray-500">{row.team} team members</span>
        </div>
      )
    },
    { 
      key: "managerName", 
      label: "Project Manager" 
    },
    { 
      key: "status", 
      label: "Status",
      render: (value) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: "progress",
      label: "Progress",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                value >= 80 ? 'bg-green-500' : 
                value >= 60 ? 'bg-yellow-500' : 
                value >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-600 min-w-[3rem]">{value}%</span>
        </div>
      )
    },
    {
      key: "priority",
      label: "Priority",
      render: (value) => (
        <div className={`px-3 py-2 rounded-lg text-xs font-medium ${getPriorityStyle(value)}`}>
          {value}
        </div>
      )
    },
    {
      key: "budget",
      label: "Budget",
      render: (value) => (
        <span className="font-semibold text-gray-900">{value}</span>
      )
    }
  ];

  // Enhanced employee table columns
  const employeeColumns = [
    { 
      key: "name", 
      label: "Employee",
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{row.avatar}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.position}</div>
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (value) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(value)}`}>
          ● {value}
        </span>
      )
    },
    {
      key: "performance",
      label: "Performance",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-900 min-w-[3rem]">{value}%</span>
        </div>
      )
    },
    {
      key: "projects",
      label: "Active Projects",
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {value}
        </span>
      )
    },
    { 
      key: "email", 
      label: "Email",
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ED</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                <p className="text-gray-500 text-sm">Enterprise Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Member</span>
              </button>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex space-x-1 border-b border-gray-200">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'team', name: 'Team', icon: '👥' },
              { id: 'projects', name: 'Projects', icon: '🚀' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm rounded-t-lg transition-all duration-200 relative ${
                  activeView === tab.id
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.name}</span>
                {activeView === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Department Head Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    {department.head.avatar}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2">{department.head.name}</h3>
                <p className="text-blue-200 font-medium text-lg mb-4">{department.head.designation}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/20">
                      <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-gray-200 font-medium">{department.head.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-emerald-400/20">
                      <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-gray-200 font-medium">{department.head.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <div className={`px-6 py-3 rounded-2xl ${getStatusStyle(department.status)} font-bold text-sm shadow-lg`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <span>{department.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Grid using DashboardCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Projects"
                value={department.totalProjects.toString()}
                change="+12%"
                icon="📊"
                trend="up"
                color="blue"
              />
              <DashboardCard
                title="Team Members"
                value={department.totalEmployees.toString()}
                change="+8%"
                icon="👥"
                trend="up"
                color="emerald"
              />
              <DashboardCard
                title="Success Rate"
                value={`${department.efficiency}%`}
                change="+5%"
                icon="⭐"
                trend="up"
                color="purple"
              />
              <DashboardCard
                title="Revenue Impact"
                value={department.revenue}
                change="+15%"
                icon="💰"
                trend="up"
                color="indigo"
              />
            </div>

            {/* Enhanced Performance Analytics */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Performance Analytics</h2>
                    <p className="text-gray-600">Real-time insights into department productivity and growth metrics</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Live Data</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-gray-100">
                <ReusableChart
                  type="bar"
                  labels={["Active Projects", "Completed Projects", "Team Members", "Efficiency %"]}
                  data={[department.activeProjects, department.completedProjects, department.totalEmployees, department.efficiency]}
                  title="Department Metrics Overview"
                />
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 mb-1">Department Budget</p>
                    <p className="text-3xl font-bold">{department.budget}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 mb-1">Client Satisfaction</p>
                    <p className="text-3xl font-bold">{department.satisfaction}%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">😊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 mb-1">On-Time Delivery</p>
                    <p className="text-3xl font-bold">92%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'team' && (
          <div className="space-y-8">
            {/* Team Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">Team Filters</h3>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="away">Away</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length} members
                </div>
              </div>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Engineering Excellence Team</h2>
                    <p className="text-indigo-200 text-lg">Meet the brilliant minds driving innovation and success</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <Table
                  columns={employeeColumns}
                  data={paginatedEmployees}
                  currentPage={employeePage}
                  totalPages={totalEmployeePages}
                  onPageChange={setEmployeePage}
                  actions={[
                    {
                      label: "View Profile",
                      type: "custom",
                      onClick: (row) => alert(`Opening comprehensive profile for ${row.name}`),
                    },
                    {
                      label: "Send Message",
                      type: "custom",
                      onClick: (row) => alert(`Composing message to ${row.name}`),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'projects' && (
          <div className="space-y-8">
            {/* Project Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600">{projects.filter(p => p.status === 'In Progress').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{projects.filter(p => p.status === 'Completed').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">At Risk</p>
                    <p className="text-3xl font-bold text-red-600">{projects.filter(p => p.health === 'At Risk' || p.health === 'Critical').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Portfolio Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Project Portfolio</h2>
                      <p className="text-emerald-200 text-lg">Innovative solutions transforming business operations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Real-time Status</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <Table
                  columns={projectColumns}
                  data={paginatedProjects}
                  currentPage={projectPage}
                  totalPages={totalProjectPages}
                  onPageChange={setProjectPage}
                  actions={[
                    {
                      label: "Open Dashboard",
                      type: "custom",
                      onClick: (row) => alert(`Launching comprehensive dashboard for: ${row.projectName}`),
                    },
                    {
                      label: "View Details",
                      type: "custom",
                      onClick: (row) => alert(`Viewing detailed analytics for: ${row.projectName}`),
                    },
                  ]}
                />
              </div>
            </div>

            {/* Project Health Overview */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Health Monitor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 truncate">{project.projectName}</h4>
                      <div className={`w-3 h-3 rounded-full ${getHealthStyle(project.health) === 'text-green-600' ? 'bg-green-500' : getHealthStyle(project.health) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            project.progress >= 80 ? 'bg-green-500' : 
                            project.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-semibold">{project.budget}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Team Size</span>
                        <span className="font-semibold">{project.team} members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Dashboard */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Advanced Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive insights and performance metrics for data-driven decisions</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Performance Trends Chart */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h3>
                  <ReusableChart
                    type="line"
                    labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                    data={[85, 88, 92, 89, 95, 98]}
                    title="Team Performance Over Time"
                  />
                </div>

                {/* Project Distribution */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Distribution</h3>
                  <ReusableChart
                    type="doughnut"
                    labels={["In Progress", "Completed", "Planning", "Review"]}
                    data={[6, 1, 1, 1]}
                    title="Project Status Breakdown"
                  />
                </div>
              </div>

              {/* Resource Utilization */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Resource Utilization</h3>
                <ReusableChart
                  type="bar"
                  labels={["Frontend", "Backend", "DevOps", "Design", "QA", "Management"]}
                  data={[12, 8, 3, 4, 5, 3]}
                  title="Team Distribution by Skill"
                />
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <span className="text-blue-200 text-sm font-medium">+15%</span>
                </div>
                <h3 className="text-blue-100 text-sm mb-1">Productivity Index</h3>
                <p className="text-3xl font-bold">94.2</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <span className="text-emerald-200 text-sm font-medium">+8%</span>
                </div>
                <h3 className="text-emerald-100 text-sm mb-1">Avg. Delivery Time</h3>
                <p className="text-3xl font-bold">12.3</p>
                <p className="text-emerald-200 text-xs">days</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💡</span>
                  </div>
                  <span className="text-purple-200 text-sm font-medium">+22%</span>
                </div>
                <h3 className="text-purple-100 text-sm mb-1">Innovation Score</h3>
                <p className="text-3xl font-bold">8.7</p>
                <p className="text-purple-200 text-xs">out of 10</p>
              </div>

              <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <span className="text-amber-200 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-amber-100 text-sm mb-1">Goal Achievement</h3>
                <p className="text-3xl font-bold">96%</p>
              </div>
            </div>

            {/* Detailed Analytics Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                <h3 className="text-2xl font-bold text-white">Detailed Performance Metrics</h3>
                <p className="text-gray-300">Comprehensive breakdown of key performance indicators</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { metric: 'Code Quality Score', value: '9.2/10', trend: '+5%', color: 'green' },
                    { metric: 'Bug Resolution Time', value: '2.1 hrs', trend: '-12%', color: 'green' },
                    { metric: 'Feature Delivery Rate', value: '15.2/week', trend: '+18%', color: 'green' },
                    { metric: 'Technical Debt Ratio', value: '8.5%', trend: '-3%', color: 'green' },
                    { metric: 'Team Collaboration Score', value: '94%', trend: '+7%', color: 'green' },
                    { metric: 'Customer Satisfaction', value: '4.8/5', trend: '+2%', color: 'green' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.metric}</h4>
                        <span className={`text-sm font-bold ${item.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;