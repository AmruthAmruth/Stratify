import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ManagerProjectDetailsPage = () => {
  const project = {
    name: "AI-Powered Chatbot",
    key: "APC-2025-001",
    description: "A comprehensive chatbot solution that provides intelligent real-time assistance to users through advanced AI algorithms and natural language processing.",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    status: "Active",
    createdBy: "John Doe",
    teamMemberSize: 12,
  };

  const backlogs = [
    {
      id: "B1",
      name: "Authentication & Security Module",
      description: "Complete user authentication system with security features including login, registration, password recovery, and role-based access control.",
      userStories: [
        {
          id: "US1",
          title: "User Login System",
          description: "As a user, I want to log into the system securely so that I can access my personalized dashboard and features.",
          priority: "High",
          status: "In Progress",
          storyPoints: 8,
          assignedTo: "Sarah Chen",
          tasks: [
            { 
              id: "T1", 
              name: "Design Login Interface", 
              description: "Create responsive and intuitive login page design with modern UI components",
              status: "Completed" 
            },
            { 
              id: "T2", 
              name: "Implement Authentication API", 
              description: "Develop secure backend API for user authentication with JWT tokens",
              status: "In Progress" 
            },
            { 
              id: "T3", 
              name: "Add Two-Factor Authentication", 
              description: "Implement 2FA security layer using SMS or email verification",
              status: "Pending" 
            },
          ],
        },
        {
          id: "US2",
          title: "User Registration Flow",
          description: "As a new user, I want to create an account easily so that I can start using the chatbot services immediately.",
          priority: "High",
          status: "Pending",
          storyPoints: 5,
          assignedTo: "Mike Rodriguez",
          tasks: [
            { 
              id: "T4", 
              name: "Create Registration Form", 
              description: "Design and develop user-friendly registration form with proper validation",
              status: "Pending" 
            },
            { 
              id: "T5", 
              name: "Email Verification System", 
              description: "Implement email verification process for new user accounts",
              status: "Pending" 
            },
          ],
        },
      ],
    },
    {
      id: "B2",
      name: "Dashboard & Analytics Module",
      description: "Comprehensive dashboard system providing users with insights, analytics, and project management capabilities.",
      userStories: [
        {
          id: "US3",
          title: "Interactive Dashboard",
          description: "As a user, I want to see a comprehensive overview of my projects and activities in an interactive dashboard.",
          priority: "Medium",
          status: "In Progress",
          storyPoints: 13,
          assignedTo: "Emily Watson",
          tasks: [
            { 
              id: "T6", 
              name: "Dashboard UI Components", 
              description: "Create reusable dashboard components with charts and metrics",
              status: "Completed" 
            },
            { 
              id: "T7", 
              name: "Real-time Data Integration", 
              description: "Implement real-time data fetching and updates for dashboard metrics",
              status: "In Progress" 
            },
          ],
        },
      ],
    },
    {
      id: "B3",
      name: "AI Chatbot Core Engine",
      description: "The main AI engine that powers the chatbot's natural language processing and response generation capabilities.",
      userStories: [
        {
          id: "US4",
          title: "Natural Language Processing",
          description: "As a user, I want the chatbot to understand my queries in natural language and provide relevant responses.",
          priority: "Critical",
          status: "In Progress",
          storyPoints: 21,
          assignedTo: "David Kim",
          tasks: [
            { 
              id: "T8", 
              name: "NLP Model Integration", 
              description: "Integrate advanced NLP models for better language understanding",
              status: "In Progress" 
            },
            { 
              id: "T9", 
              name: "Response Generation System", 
              description: "Develop intelligent response generation based on user context and history",
              status: "Pending" 
            },
          ],
        },
      ],
    },
  ];

  // Calculate comprehensive statistics
  const allUserStories = backlogs.flatMap((b) => b.userStories);
  const allTasks = allUserStories.flatMap((us) => us.tasks);
  
  const taskCounts = {
    Pending: allTasks.filter((t) => t.status === "Pending").length,
    "In Progress": allTasks.filter((t) => t.status === "In Progress").length,
    Completed: allTasks.filter((t) => t.status === "Completed").length,
  };

  const userStoryCounts = {
    Pending: allUserStories.filter((us) => us.status === "Pending").length,
    "In Progress": allUserStories.filter((us) => us.status === "In Progress").length,
    Completed: allUserStories.filter((us) => us.status === "Completed").length,
  };

  const totalStoryPoints = allUserStories.reduce((sum, us) => sum + us.storyPoints, 0);
  const completedStoryPoints = allUserStories
    .filter(us => us.status === "Completed")
    .reduce((sum, us) => sum + us.storyPoints, 0);

  const taskData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [taskCounts.Pending, taskCounts["In Progress"], taskCounts.Completed],
        backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
        borderColor: ["#DC2626", "#D97706", "#059669"],
        borderWidth: 3,
      },
    ],
  };

  const storyData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "User Stories",
        data: [userStoryCounts.Pending, userStoryCounts["In Progress"], userStoryCounts.Completed],
        backgroundColor: ["#8B5CF6", "#06B6D4", "#84CC16"],
        borderColor: ["#7C3AED", "#0891B2", "#65A30D"],
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: { size: 13, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: { 
        display: true, 
        font: { size: 16, weight: 700 },
        padding: 20,
        color: '#1e293b'
      },
    },
  };

  const [expandedBacklog, setExpandedBacklog] = useState<string | null>(null);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-700 bg-emerald-100 border-emerald-300";
      case "In Progress": return "text-amber-700 bg-amber-100 border-amber-300";
      case "Pending": return "text-red-700 bg-red-100 border-red-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-red-700 bg-red-100 border-red-300";
      case "High": return "text-orange-700 bg-orange-100 border-orange-300";
      case "Medium": return "text-blue-700 bg-blue-100 border-blue-300";
      case "Low": return "text-gray-700 bg-gray-100 border-gray-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {project.key}
                </span>
              </div>
              <p className="text-blue-100 text-lg max-w-3xl leading-relaxed">{project.description}</p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-center">
                  <div className="text-3xl font-bold">{project.status}</div>
                  <div className="text-blue-200 text-sm mt-1">Project Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Charts Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Task Distribution</h3>
              <div className="h-64">
                <Doughnut data={taskData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">User Story Progress</h3>
              <div className="h-64">
                <Doughnut data={storyData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { display: false }}}} />
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Team Size */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Team Size</p>
                  <p className="text-3xl font-bold mt-1">{project.teamMemberSize}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Backlogs */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Backlogs</p>
                  <p className="text-3xl font-bold mt-1">{backlogs.length}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h2a1 1 0 100-2H7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Story Points */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Story Points</p>
                  <p className="text-3xl font-bold mt-1">{completedStoryPoints}/{totalStoryPoints}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-semibold uppercase tracking-wide">Total Tasks</p>
                  <p className="text-3xl font-bold mt-1">{allTasks.length}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"/>
              </svg>
            </div>
            Project Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Project Manager</p>
              <p className="text-lg font-semibold text-gray-900">{project.createdBy}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.startDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">End Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.endDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Premium Backlogs Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
              </div>
              Project Backlogs
            </h3>
          </div>
          
          <div className="p-8 space-y-6">
            {backlogs.map((backlog, backlogIndex) => (
              <div key={backlog.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                  onClick={() =>
                    setExpandedBacklog(expandedBacklog === backlog.id ? null : backlog.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-bold rounded-lg">
                          {backlog.id}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{backlog.name}</h4>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">{backlog.description}</p>
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-semibold text-indigo-600">
                          {backlog.userStories.length} User {backlog.userStories.length === 1 ? 'Story' : 'Stories'}
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {backlog.userStories.reduce((sum, us) => sum + us.tasks.length, 0)} Tasks
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        expandedBacklog === backlog.id 
                          ? 'bg-indigo-600 text-white transform rotate-180' 
                          : 'bg-white text-gray-400 hover:bg-indigo-100 hover:text-indigo-600'
                      }`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedBacklog === backlog.id && (
                  <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                    {backlog.userStories.map((us, storyIndex) => (
                      <div key={us.id} className="border border-gray-300 rounded-xl overflow-hidden shadow-md">
                        <div
                          className="bg-gray-50 p-5 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                          onClick={() =>
                            setExpandedStory(expandedStory === us.id ? null : us.id)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                  {us.id}
                                </span>
                                <h5 className="text-lg font-bold text-gray-900">{us.title}</h5>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(us.priority)}`}>
                                  {us.priority}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-4 leading-relaxed">{us.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-4">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(us.status)}`}>
                                  {us.status}
                                </span>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                  </svg>
                                  <span className="font-semibold">{us.storyPoints} Points</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                  </svg>
                                  <span className="font-semibold">{us.assignedTo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                                  </svg>
                                  <span className="font-semibold">{us.tasks.length} Tasks</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                expandedStory === us.id 
                                  ? 'bg-purple-600 text-white transform rotate-180' 
                                  : 'bg-white text-gray-400 hover:bg-purple-100 hover:text-purple-600'
                              }`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {expandedStory === us.id && (
                          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                            <h6 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                              </svg>
                              Tasks
                            </h6>
                            
                            <div className="grid gap-4">
                              {us.tasks.map((task, taskIndex) => (
                                <div key={task.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                        {task.id}
                                      </span>
                                      <h6 className="text-lg font-bold text-gray-900">{task.name}</h6>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-600 leading-relaxed pl-8">{task.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary Footer */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center">Project Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round((taskCounts.Completed / allTasks.length) * 100)}%</div>
              <div className="text-blue-200">Tasks Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round((completedStoryPoints / totalStoryPoints) * 100)}%</div>
              <div className="text-blue-200">Story Points Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{allUserStories.length}</div>
              <div className="text-blue-200">Total User Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</div>
              <div className="text-blue-200">Days Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProjectDetailsPage;