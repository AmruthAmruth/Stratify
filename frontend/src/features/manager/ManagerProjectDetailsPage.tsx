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
  // Project Data from JSON
  const project = {
    name: "AI-Powered Chatbot",
    key: "CHATBOT-001",
    description: "A chatbot that provides real-time AI assistance to users.",
    startDate: "2025-09-01T00:00:00.000Z",
    endDate: "2025-12-15T00:00:00.000Z",
    status: "Active",
    projectLead: "John Doe",
    totalTeamMembers: 8,
    remainingDays: 81,
    backlogs: [
      {
        name: "User Interface",
        description: "All UI related tasks for the chatbot.",
        numberOfEmployees: 3,
        userStories: [
          {
            name: "Login Page",
            description: "Create login page with validation",
            priority: "High",
            status: "InProgress",
            storyPoints: 8,
            assignedTo: "Alice",
            tasks: [
              {
                name: "Design login form",
                description: "Create login form UI",
                status: "Completed",
              },
              {
                name: "Validate inputs",
                description: "Add input validation",
                status: "InProgress",
              },
            ],
          },
          {
            name: "Dashboard UI",
            description: "Design dashboard for displaying chatbot responses",
            priority: "Medium",
            status: "Planned",
            storyPoints: 5,
            assignedTo: "Charlie",
            tasks: [
              {
                name: "Create dashboard layout",
                description: "Design main dashboard layout",
                status: "Planned",
              },
              {
                name: "Integrate charts",
                description: "Add charts for analytics",
                status: "Planned",
              },
            ],
          },
        ],
      },
      {
        name: "Backend APIs",
        description: "API development for the chatbot functionality.",
        numberOfEmployees: 5,
        userStories: [
          {
            name: "User Authentication",
            description: "API for user login and registration",
            priority: "High",
            status: "Planned",
            storyPoints: 13,
            assignedTo: "Bob",
            tasks: [
              {
                name: "Create login API",
                description: "Develop API endpoint for login",
                status: "Planned",
              },
              {
                name: "Create registration API",
                description: "Develop API endpoint for registration",
                status: "Planned",
              },
              {
                name: "Add JWT authentication",
                description: "Secure APIs with JWT tokens",
                status: "Planned",
              },
            ],
          },
          {
            name: "Chatbot Engine",
            description: "Backend logic for AI responses",
            priority: "High",
            status: "InProgress",
            storyPoints: 20,
            assignedTo: "Dave",
            tasks: [
              {
                name: "Integrate AI model",
                description: "Connect AI engine to backend",
                status: "InProgress",
              },
              {
                name: "Create response API",
                description: "API to fetch AI response",
                status: "InProgress",
              },
            ],
          },
        ],
      },
    ],
    sprints: [
      {
        name: "Sprint 1",
        startDate: "2025-09-01T00:00:00.000Z",
        endDate: "2025-09-15T00:00:00.000Z",
        goal: "Setup project structure and login functionality",
        status: "Completed",
        userStories: [
          {
            name: "Login Page",
            description: "Create login page with validation",
            priority: "High",
            status: "Completed",
            storyPoints: 8,
            assignedTo: "Alice",
            tasks: [
              {
                name: "Design login form",
                description: "Create login form UI",
                status: "Completed",
              },
              {
                name: "Validate inputs",
                description: "Add input validation",
                status: "Completed",
              },
            ],
          },
        ],
      },
      {
        name: "Sprint 2",
        startDate: "2025-09-16T00:00:00.000Z",
        endDate: "2025-09-30T00:00:00.000Z",
        goal: "Develop backend authentication APIs",
        status: "Active",
        userStories: [
          {
            name: "User Authentication",
            description: "API for user login and registration",
            priority: "High",
            status: "InProgress",
            storyPoints: 13,
            assignedTo: "Bob",
            tasks: [
              {
                name: "Create login API",
                description: "Develop API endpoint for login",
                status: "InProgress",
              },
              {
                name: "Create registration API",
                description: "Develop API endpoint for registration",
                status: "Planned",
              },
              {
                name: "Add JWT authentication",
                description: "Secure APIs with JWT tokens",
                status: "Planned",
              },
            ],
          },
        ],
      },
    ],
  };

  // Calculate Statistics
  const allUserStories = project.backlogs.flatMap((b) => b.userStories);
  const allTasks = allUserStories.flatMap((us) => us.tasks);
  const allSprintUserStories = project.sprints.flatMap((s) => s.userStories);

  const taskCounts = {
    Planned: allTasks.filter((t) => t.status === "Planned").length,
    InProgress: allTasks.filter((t) => t.status === "InProgress").length,
    Completed: allTasks.filter((t) => t.status === "Completed").length,
  };

  const userStoryCounts = {
    Planned: allUserStories.filter((us) => us.status === "Planned").length,
    InProgress: allUserStories.filter((us) => us.status === "InProgress").length,
    Completed: allUserStories.filter((us) => us.status === "Completed").length,
  };

  const sprintCounts = {
    Planned: project.sprints.filter((s) => s.status === "Planned").length,
    Active: project.sprints.filter((s) => s.status === "Active").length,
    Completed: project.sprints.filter((s) => s.status === "Completed").length,
  };

  const totalStoryPoints = allUserStories.reduce(
    (sum, us) => sum + us.storyPoints,
    0
  );
  const completedStoryPoints = allUserStories
    .filter((us) => us.status === "Completed")
    .reduce((sum, us) => sum + us.storyPoints, 0);

  // Chart Data
  const taskData = {
    labels: ["Planned", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [taskCounts.Planned, taskCounts.InProgress, taskCounts.Completed],
        backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
        borderColor: ["#DC2626", "#D97706", "#059669"],
        borderWidth: 3,
      },
    ],
  };

  const storyData = {
    labels: ["Planned", "In Progress", "Completed"],
    datasets: [
      {
        label: "User Stories",
        data: [
          userStoryCounts.Planned,
          userStoryCounts.InProgress,
          userStoryCounts.Completed,
        ],
        backgroundColor: ["#8B5CF6", "#06B6D4", "#84CC16"],
        borderColor: ["#7C3AED", "#0891B2", "#65A30D"],
        borderWidth: 3,
      },
    ],
  };

  const sprintData = {
    labels: ["Planned", "Active", "Completed"],
    datasets: [
      {
        label: "Sprints",
        data: [sprintCounts.Planned, sprintCounts.Active, sprintCounts.Completed],
        backgroundColor: ["#6B7280", "#3B82F6", "#22C55E"],
        borderColor: ["#4B5563", "#2563EB", "#16A34A"],
        borderWidth: 3,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 13, weight: 600 },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        font: { size: 16, weight: 700 },
        padding: 20,
        color: "#1e293b",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14, weight: 600 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  // State for Expandable Sections
  const [expandedBacklog, setExpandedBacklog] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);
  const [expandedSprint, setExpandedSprint] = useState(null);

  // Utility Functions for Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-emerald-700 bg-emerald-100 border-emerald-300";
      case "InProgress":
      case "Active":
        return "text-amber-700 bg-amber-100 border-amber-300";
      case "Planned":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-orange-700 bg-orange-100 border-orange-300";
      case "Medium":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "Low":
        return "text-gray-700 bg-gray-100 border-gray-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
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
              <p className="text-blue-100 text-lg max-w-3xl leading-relaxed">
                {project.description}
              </p>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Task Distribution</h3>
              <div className="h-64">
                <Doughnut
                  data={taskData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: false } },
                  }}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">User Story Progress</h3>
              <div className="h-64">
                <Doughnut
                  data={storyData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: false } },
                  }}
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sprint Progress</h3>
              <div className="h-64">
                <Doughnut
                  data={sprintData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">
                    Team Size
                  </p>
                  <p className="text-3xl font-bold mt-1">{project.totalTeamMembers}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">
                    Backlogs
                  </p>
                  <p className="text-3xl font-bold mt-1">{project.backlogs.length}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h2a1 1 0 100-2H7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">
                    Story Points
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {completedStoryPoints}/{totalStoryPoints}
                  </p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745 “‘745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745.723 3.066 3.066 0 012.812-2.812zM7.44 8.707a1 1 0 00-1.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-semibold uppercase tracking-wide">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold mt-1">{allTasks.length}</p>
                </div>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                />
              </svg>
            </div>
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Project Lead
              </p>
              <p className="text-lg font-semibold text-gray-900">{project.projectLead}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Start Date
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                End Date
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Remaining Days
              </p>
              <p className="text-lg font-semibold text-gray-900">{project.remainingDays}</p>
            </div>
          </div>
        </div>

        {/* Sprints Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z"
                  />
                </svg>
              </div>
              Sprints
            </h3>
          </div>
          <div className="p-8 space-y-6">
            {project.sprints.map((sprint, index) => (
              <div
                key={sprint.name}
                className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 cursor-pointer hover:from-teal-100 hover:to-cyan-100 transition-all duration-300"
                  onClick={() =>
                    setExpandedSprint(expandedSprint === sprint.name ? null : sprint.name)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-teal-600 text-white text-sm font-bold rounded-lg">
                          {sprint.name}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{sprint.goal}</h4>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {new Date(sprint.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(sprint.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center space-x-6">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(sprint.status)}`}>
                          {sprint.status}
                        </span>
                        <span className="text-sm font-semibold text-teal-600">
                          {sprint.userStories.length} User{" "}
                          {sprint.userStories.length === 1 ? "Story" : "Stories"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          expandedSprint === sprint.name
                            ? "bg-teal-600 text-white transform rotate-180"
                            : "bg-white text-gray-400 hover:bg-teal-100 hover:text-teal-600"
                        }`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedSprint === sprint.name && (
                  <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                    {sprint.userStories.map((us) => (
                      <div
                        key={us.name}
                        className="border border-gray-300 rounded-xl overflow-hidden shadow-md"
                      >
                        <div
                          className="bg-gray-50 p-5 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                          onClick={() =>
                            setExpandedStory(expandedStory === us.name ? null : us.name)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                  {us.name}
                                </span>
                                <h5 className="text-lg font-bold text-gray-900">{us.description}</h5>
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                                    us.priority
                                  )}`}
                                >
                                  {us.priority}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <span
                                  className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                    us.status
                                  )}`}
                                >
                                  {us.status}
                                </span>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.storyPoints} Points</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.assignedTo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.tasks.length} Tasks</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                  expandedStory === us.name
                                    ? "bg-purple-600 text-white transform rotate-180"
                                    : "bg-white text-gray-400 hover:bg-purple-100 hover:text-purple-600"
                                }`}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {expandedStory === us.name && (
                          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                            <h6 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                              <svg
                                className="w-5 h-5 text-indigo-600 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                />
                              </svg>
                              Tasks
                            </h6>
                            <div className="grid gap-4">
                              {us.tasks.map((task) => (
                                <div
                                  key={task.name}
                                  className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                        {task.name}
                                      </span>
                                      <h6 className="text-lg font-bold text-gray-900">
                                        {task.description}
                                      </h6>
                                    </div>
                                    <span
                                      className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                        task.status
                                      )}`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>
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

        {/* Backlogs Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              Project Backlogs
            </h3>
          </div>
          <div className="p-8 space-y-6">
            {project.backlogs.map((backlog, index) => (
              <div
                key={backlog.name}
                className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 cursor-pointer hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                  onClick={() =>
                    setExpandedBacklog(expandedBacklog === backlog.name ? null : backlog.name)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-bold rounded-lg">
                          {backlog.name}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{backlog.description}</h4>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-semibold text-indigo-600">
                          {backlog.userStories.length} User{" "}
                          {backlog.userStories.length === 1 ? "Story" : "Stories"}
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {backlog.numberOfEmployees} Employees
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          expandedBacklog === backlog.name
                            ? "bg-indigo-600 text-white transform rotate-180"
                            : "bg-white text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                        }`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedBacklog === backlog.name && (
                  <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                    {backlog.userStories.map((us) => (
                      <div
                        key={us.name}
                        className="border border-gray-300 rounded-xl overflow-hidden shadow-md"
                      >
                        <div
                          className="bg-gray-50 p-5 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                          onClick={() =>
                            setExpandedStory(expandedStory === us.name ? null : us.name)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                  {us.name}
                                </span>
                                <h5 className="text-lg font-bold text-gray-900">{us.description}</h5>
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                                    us.priority
                                  )}`}
                                >
                                  {us.priority}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <span
                                  className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                    us.status
                                  )}`}
                                >
                                  {us.status}
                                </span>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.storyPoints} Points</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.assignedTo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    />
                                  </svg>
                                  <span className="font-semibold">{us.tasks.length} Tasks</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                  expandedStory === us.name
                                    ? "bg-purple-600 text-white transform rotate-180"
                                    : "bg-white text-gray-400 hover:bg-purple-100 hover:text-purple-600"
                                }`}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {expandedStory === us.name && (
                          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                            <h6 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                              <svg
                                className="w-5 h-5 text-indigo-600 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                />
                              </svg>
                              Tasks
                            </h6>
                            <div className="grid gap-4">
                              {us.tasks.map((task) => (
                                <div
                                  key={task.name}
                                  className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                        {task.name}
                                      </span>
                                      <h6 className="text-lg font-bold text-gray-900">
                                        {task.description}
                                      </h6>
                                    </div>
                                    <span
                                      className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                        task.status
                                      )}`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>
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

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-center">Project Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {Math.round((taskCounts.Completed / allTasks.length) * 100)}%
              </div>
              <div className="text-blue-200">Tasks Complete</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {Math.round((completedStoryPoints / totalStoryPoints) * 100)}%
              </div>
              <div className="text-blue-200">Story Points Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{allUserStories.length}</div>
              <div className="text-blue-200">Total User Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{project.remainingDays}</div>
              <div className="text-blue-200">Days Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProjectDetailsPage;