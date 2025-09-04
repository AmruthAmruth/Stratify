import React, { useState } from "react";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import Table from "@/shared/components/Table/Table";
import ReusableChart from "@/shared/components/Chart/ReusableChart";

interface Employee {
  name: string;
  email: string;
  phone: string;
  position: string;
}

interface Project {
  projectName: string;
  managerName: string;
  status: string;
}

const DepartmentDetailsPage: React.FC = () => {
  const department = {
    name: "Engineering Department",
    description: "Driving innovation through cutting-edge technology solutions and exceptional engineering practices.",
    status: "Active",
    head: {
      name: "Amruth Shyju",
      email: "amruth.shyju@company.com",
      phone: "+91 98765 43210",
      designation: "Head of Engineering"
    },
    totalProjects: 12,
    totalEmployees: 35,
    activeProjects: 8,
    completedProjects: 4,
    efficiency: 95,
  };

  const employees: Employee[] = [
    { name: "Alice Johnson", email: "alice.johnson@company.com", phone: "+91 98765 43211", position: "Senior Full Stack Developer" },
    { name: "Robert Smith", email: "robert.smith@company.com", phone: "+91 98765 43212", position: "Lead QA Engineer" },
    { name: "Sarah Wilson", email: "sarah.wilson@company.com", phone: "+91 98765 43213", position: "Senior UI/UX Designer" },
    { name: "Michael Chen", email: "michael.chen@company.com", phone: "+91 98765 43214", position: "DevOps Architect" },
    { name: "Emma Rodriguez", email: "emma.rodriguez@company.com", phone: "+91 98765 43215", position: "Technical Project Manager" },
    { name: "David Thompson", email: "david.thompson@company.com", phone: "+91 98765 43216", position: "Backend Engineer" },
  ];

  const projects: Project[] = [
    { projectName: "Next-Gen ERP Platform", managerName: "Amruth Shyju", status: "In Progress" },
    { projectName: "Mobile Commerce App", managerName: "Alice Johnson", status: "Completed" },
    { projectName: "AI-Powered Analytics", managerName: "Robert Smith", status: "In Progress" },
    { projectName: "Customer Portal 2.0", managerName: "Sarah Wilson", status: "Planning" },
    { projectName: "Cloud Infrastructure", managerName: "Michael Chen", status: "In Progress" },
    { projectName: "Security Enhancement", managerName: "Emma Rodriguez", status: "Review" },
  ];

  const [employeePage, setEmployeePage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const pageSize = 4;

  const paginatedEmployees = employees.slice(
    (employeePage - 1) * pageSize,
    employeePage * pageSize
  );
  const totalEmployeePages = Math.ceil(employees.length / pageSize);

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
      'Review': 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-800 text-sm font-semibold mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
              Department Overview
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              {department.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {department.description}
            </p>
          </div>

          {/* Department Head Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-gray-800">
                      {department.head.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{department.head.name}</h3>
                  <p className="text-blue-200 font-medium mb-4">{department.head.designation}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-200">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{department.head.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-200">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{department.head.phone}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-6 py-3 rounded-full ${getStatusStyle(department.status)} font-bold text-sm`}>
                  ● {department.status}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { title: "Total Projects", value: department.totalProjects, color: "from-blue-500 to-blue-600", icon: "📊", change: "+12%" },
              { title: "Team Members", value: department.totalEmployees, color: "from-emerald-500 to-emerald-600", icon: "👥", change: "+8%" },
              { title: "Active Projects", value: department.activeProjects, color: "from-amber-500 to-amber-600", icon: "🚀", change: "+15%" },
              { title: "Success Rate", value: `${department.efficiency}%`, color: "from-purple-500 to-purple-600", icon: "⭐", change: "+5%" }
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    <span className="text-green-600 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 font-medium text-sm mb-2">{stat.title}</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-1000`} 
                         style={{ width: `${Math.min(typeof stat.value === 'string' ? parseInt(stat.value) : stat.value * 3, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Performance Analytics</h2>
              <p className="text-gray-600">Real-time insights into department productivity and growth</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
              <ReusableChart
                type="bar"
                labels={["Active Projects", "Completed Projects", "Team Members", "Efficiency %"]}
                data={[department.activeProjects, department.completedProjects, department.totalEmployees, department.efficiency]}
                title="Department Metrics Overview"
              />
            </div>
          </div>

          {/* Tables Section */}
          <div className="space-y-16">
            
            {/* Team Members */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Our Amazing Team</h2>
                    <p className="text-indigo-200">Meet the brilliant minds driving our success</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <Table
                  columns={[
                    { key: "name", label: "Full Name" },
                    { key: "position", label: "Position" },
                    { key: "email", label: "Email Address" },
                    { key: "phone", label: "Contact" },
                  ]}
                  data={paginatedEmployees}
                  currentPage={employeePage}
                  totalPages={totalEmployeePages}
                  onPageChange={setEmployeePage}
                  actions={[
                    {
                      label: "View Profile",
                      type: "custom",
                      onClick: (row) => alert(`Opening profile for ${row.name}`),
                    },
                  ]}
                />
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Project Portfolio</h2>
                    <p className="text-emerald-200">Innovative solutions in development</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <Table
                  columns={[
                    { key: "projectName", label: "Project Name" },
                    { key: "managerName", label: "Project Manager" },
                    { 
                      key: "status", 
                      label: "Current Status",
                      render: (value) => (
                        <span className={`px-4 py-2 text-xs font-bold rounded-full ${getStatusStyle(value)}`}>
                          {value}
                        </span>
                      )
                    },
                  ]}
                  data={paginatedProjects}
                  currentPage={projectPage}
                  totalPages={totalProjectPages}
                  onPageChange={setProjectPage}
                  actions={[
                    {
                      label: "Open Project",
                      type: "custom",
                      onClick: (row) => alert(`Launching project dashboard for: ${row.projectName}`),
                    },
                  ]}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;