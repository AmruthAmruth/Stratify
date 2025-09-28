import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import CollapsibleSection from "@/shared/components/CollapsibleSection/CollapsibleSection";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import { getProjectDetails } from "@/services/projects";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ManagerProjectDetailsPage = () => {
  // State for project data
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Expandable Sections
  const [expandedBacklog, setExpandedBacklog] = useState(null);
  const [expandedSprint, setExpandedSprint] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);
 const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const fetchProjectData = async (id:string) => {
      try {
        setLoading(true);
        const data = await getProjectDetails(id);
        console.log("DATA ", data);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData(id!);
  }, [id]);





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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No project data available</p>
        </div>
      </div>
    );
  }

  // Calculate Statistics
  const allUserStories = project.backlogs?.flatMap((b) => b.userStories || []) || [];
  const allTasks = allUserStories.flatMap((us) => us.tasks || []);

  const taskCounts = {
    Planned: allTasks.filter((t) => t.status === "Planned").length,
    InProgress: allTasks.filter((t) => t.status === "InProgress" || t.status === "In Progress").length,
    Completed: allTasks.filter((t) => t.status === "Completed").length,
  };

  const userStoryCounts = {
    Planned: allUserStories.filter((us) => us.status === "Planned").length,
    InProgress: allUserStories.filter((us) => us.status === "InProgress" || us.status === "In Progress").length,
    Completed: allUserStories.filter((us) => us.status === "Completed").length,
  };

  const sprintCounts = {
    Planned: (project.sprints || []).filter((s) => s.status === "Planned").length,
    Active: (project.sprints || []).filter((s) => s.status === "Active").length,
    Completed: (project.sprints || []).filter((s) => s.status === "Completed").length,
  };

  const totalStoryPoints = allUserStories.reduce(
    (sum, us) => sum + (us.storyPoints || 0),
    0
  );
  const completedStoryPoints = allUserStories
    .filter((us) => us.status === "Completed")
    .reduce((sum, us) => sum + (us.storyPoints || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="flex items-center justify-center p-4 pt-10">
        <div className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 lg:p-10">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Project Info */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {project.name}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-sm font-medium text-indigo-700 rounded-full border border-indigo-200">
                    {project.key}
                  </span>
                </div>
                <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>

              {/* Status Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="bg-indigo-50 rounded-lg p-5 w-full max-w-xs text-center border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200">
                  <div className="text-2xl font-semibold text-indigo-700">
                    {project.status}
                  </div>
                  <div className="text-gray-500 text-sm mt-1 font-medium tracking-wide">
                    Project Status
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Analytics Dashboard */}
        <div className="space-y-8">
          {/* Metrics Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <DashboardCard
              title="Team Size"
              value={project.totalTeamMembers || 0}
              subtitle="Members"
              trend={(project.totalTeamMembers || 0) > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Backlogs"
              value={(project.backlogs || []).length}
              subtitle="Pending"
              trend={(project.backlogs || []).length > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Story Points"
              value={`${completedStoryPoints}/${totalStoryPoints}`}
              subtitle="Completed/Total"
              trend={completedStoryPoints > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Total Tasks"
              value={allTasks.length}
              subtitle="Tasks"
              trend={allTasks.length > 0 ? "up" : "down"}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Task Distribution
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-100">
                  <ReusableChart
                    type="doughnut"
                    title="Tasks"
                    labels={["Planned", "In Progress", "Completed"]}
                    data={[
                      taskCounts.Planned,
                      taskCounts.InProgress,
                      taskCounts.Completed,
                    ]}
                    backgroundColors={["#EF4444", "#F59E0B", "#10B981"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                User Story Progress
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-100">
                  <ReusableChart
                    type="doughnut"
                    title="User Stories"
                    labels={["Planned", "In Progress", "Completed"]}
                    data={[
                      userStoryCounts.Planned,
                      userStoryCounts.InProgress,
                      userStoryCounts.Completed,
                    ]}
                    backgroundColors={["#8B5CF6", "#06B6D4", "#84CC16"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Sprint Progress
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-100">
                  <ReusableChart
                    type="doughnut"
                    title="Sprints"
                    labels={["Planned", "Active", "Completed"]}
                    data={[
                      sprintCounts.Planned,
                      sprintCounts.Active,
                      sprintCounts.Completed,
                    ]}
                    backgroundColors={["#6B7280", "#3B82F6", "#22C55E"]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl lg:text-2xl font-bold mb-5 text-center text-gray-900 tracking-tight">
              Project Progress Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Tasks Complete"
                value={
                  allTasks.length > 0
                    ? `${Math.round(
                        (taskCounts.Completed / allTasks.length) * 100
                      )}%`
                    : "0%"
                }
                subtitle="Tasks"
                trend={taskCounts.Completed > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Story Points Done"
                value={
                  totalStoryPoints > 0
                    ? `${Math.round(
                        (completedStoryPoints / totalStoryPoints) * 100
                      )}%`
                    : "0%"
                }
                subtitle="Story Points"
                trend={completedStoryPoints > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Total User Stories"
                value={allUserStories.length}
                subtitle="Stories"
                trend={allUserStories.length > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Days Remaining"
                value={project.remainingDays || 0}
                subtitle="Days"
                trend={(project.remainingDays || 0) > 0 ? "up" : "down"}
              />
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center mr-2">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                />
              </svg>
            </div>
            Project Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Lead
              </p>
              <p className="text-base font-semibold text-gray-900">
                {project.projectLead || "Not assigned"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </p>
              <p className="text-base font-semibold text-gray-900">
                {project.startDate 
                  ? new Date(project.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </p>
              <p className="text-base font-semibold text-gray-900">
                {project.endDate 
                  ? new Date(project.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining Days
              </p>
              <p className="text-base font-semibold text-gray-900">
                {project.remainingDays || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Sprints Section - Using Reusable Component */}
        {project.sprints && project.sprints.length > 0 && (
          <CollapsibleSection
            title="Sprints"
            icon={
              <svg
                className="w-5 h-5 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z"
                />
              </svg>
            }
            iconBgColor="bg-teal-100"
            iconColor="text-teal-600"
            data={project.sprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            expandedStory={expandedStory}
            setExpandedStory={setExpandedStory}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        )}

        {/* Backlogs Section - Using Reusable Component */}
        {project.backlogs && project.backlogs.length > 0 && (
          <CollapsibleSection
            title="Project Backlogs"
            icon={
              <svg
                className="w-5 h-5 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z"
                />
              </svg>
            }
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            data={project.backlogs}
            type="backlog"
            expandedItem={expandedBacklog}
            setExpandedItem={setExpandedBacklog}
            expandedStory={expandedStory}
            setExpandedStory={setExpandedStory}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerProjectDetailsPage;