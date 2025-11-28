import React, { useEffect, useState, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import CollapsibleSection from "@/shared/components/CollapsibleSection/CollapsibleSection";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import {
  createSubTask,
  employeeUnderTheProject,
  getProjectDetails,
} from "@/services/projects";
import { useParams } from "react-router-dom";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import {
  createSubTaskFields,
} from "@/shared/components/Forms/formFields";
import {
  createSubTaskSchema,
} from "@/shared/utils/validations";
import { enqueueSnackbar } from "notistack";
import * as z from "zod";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Assume employeeId is obtained from auth context or props
const EMPLOYEE_ID = "current-employee-id"; // Replace with actual employee ID from auth

const EmployeeProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [expandedBacklog, setExpandedBacklog] = useState(null);
  const [expandedSprint, setExpandedSprint] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectData = async (id) => {
      try {
        setLoading(true);
        const data = await getProjectDetails(id);
        const employeeData = await employeeUnderTheProject(id);

        if (employeeData && employeeData.employee) {
          setEmployees(employeeData.employee);
        }
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData(id);
  }, [id]);

  // Filter issues assigned to current employee
  const assignedIssues = useMemo(() => {
    if (!project) return [];
    const allBacklogIssues = project.backlog || [];
    const allSprints = [
      ...(project.activeSprints || []),
      ...(project.plannedSprints || []),
      ...(project.completedSprints || []),
    ];
    const allSprintIssues = allSprints.flatMap((sprint) => sprint.issues || []);
    const allIssues = [...allBacklogIssues, ...allSprintIssues];
    return allIssues.filter((issue) => issue.assignedTo === EMPLOYEE_ID);
  }, [project]);

  // Filter subtasks for assigned issues
  const assignedSubTasks = useMemo(() => {
    return assignedIssues.flatMap((issue) => issue.subTasks || []);
  }, [assignedIssues]);

  const allActiveSprints = (project?.activeSprints || []).filter((sprint) =>
    sprint.issues?.some((issue) => issue.assignedTo === EMPLOYEE_ID)
  );
  const allPlannedSprints = (project?.plannedSprints || []).filter((sprint) =>
    sprint.issues?.some((issue) => issue.assignedTo === EMPLOYEE_ID)
  );
  const allCompletedSprints = (project?.completedSprints || []).filter((sprint) =>
    sprint.issues?.some((issue) => issue.assignedTo === EMPLOYEE_ID)
  );
  const allSprints = [
    ...allActiveSprints,
    ...allPlannedSprints,
    ...allCompletedSprints,
  ];

  const issueCounts = {
    Planned: assignedIssues.filter((i) => i.status === "Planned").length,
    InProgress: assignedIssues.filter(
      (i) => i.status === "InProgress" || i.status === "In Progress"
    ).length,
    Done: assignedIssues.filter(
      (i) => i.status === "Done" || i.status === "Completed"
    ).length,
  };

  const subTaskCounts = {
    Planned: assignedSubTasks.filter((t) => t.status === "Planned").length,
    InProgress: assignedSubTasks.filter((t) => t.status === "In Progress").length,
    Done: assignedSubTasks.filter((t) => t.status === "Done").length,
  };

  const sprintCounts = {
    Planned: allPlannedSprints.length,
    Active: allActiveSprints.length,
    Completed: allCompletedSprints.length,
  };

  const totalEstimatedHours = assignedIssues.reduce(
    (sum, i) => sum + (i.estimatedHours || 0),
    0
  );
  const completedEstimatedHours = assignedIssues
    .filter((i) => i.status === "Done" || i.status === "Completed")
    .reduce((sum, i) => sum + (i.estimatedHours || 0), 0);

  const handleCreateSubTask = async (values) => {
    if (!selectedIssue) return;
    setSubmitLoading(true);
    try {
      const payload = {
        ...values,
        issueId: selectedIssue.id || selectedIssue._id,
        projectId: id,
        assignedTo: EMPLOYEE_ID,
      };
      await createSubTask(payload);
      enqueueSnackbar("SubTask created successfully!", { variant: "success" });
      const updatedProject = await getProjectDetails(id);
      setProject(updatedProject);
      setIsSubTaskModalOpen(false);
      setSelectedIssue(null);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to create subtask.", {
        variant: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const openSubTaskModal = (issue) => {
    setSelectedIssue(issue);
    setIsSubTaskModalOpen(true);
  };

  const closeSubTaskModal = () => {
    setIsSubTaskModalOpen(false);
    setSelectedIssue(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Done":
        return "text-[#009063] bg-[#e6f7f0] border-[#009063]";
      case "InProgress":
      case "In Progress":
      case "Active":
        return "text-[#3b3b3b] bg-[#dfdcef] border-[#9b8dc9]";
      case "Planned":
        return "text-[#3b3b3b] bg-[#fbfbfb] border-[#dfdcef]";
      default:
        return "text-[#3b3b3b] bg-[#fbfbfb] border-[#dfdcef]";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-700 bg-red-50 border-red-300";
      case "Medium":
        return "text-[#3b3b3b] bg-[#dfdcef] border-[#9b8dc9]";
      case "Low":
        return "text-[#3b3b3b] bg-[#fbfbfb] border-[#dfdcef]";
      default:
        return "text-[#3b3b3b] bg-[#fbfbfb] border-[#dfdcef]";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Bug":
        return "text-red-700 bg-red-50 border-red-300";
      case "User Story":
        return "text-[#009063] bg-[#e6f7f0] border-[#009063]";
      case "Task":
        return "text-[#3b3b3b] bg-[#dfdcef] border-[#9b8dc9]";
      default:
        return "text-[#3b3b3b] bg-[#fbfbfb] border-[#dfdcef]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#009063] mx-auto"></div>
          <p className="mt-4 text-lg text-[#3b3b3b]">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#009063] hover:bg-[#007a52] text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#3b3b3b]">No project data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="bg-[#fbfbfb] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#e9e6f5] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#2f2f2f] tracking-tight">
                      {project.name}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 bg-[#f1effa] text-sm font-medium text-[#514f63] rounded-full border border-[#e3e0f3]">
                      {project.key}
                    </span>
                  </div>
                  <p className="text-[#3b3b3b]/90 text-base leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div className="rounded-xl bg-gradient-to-br from-[#f7f9fc] to-[#f1effa] border border-[#e3e0f3] px-8 py-6 text-center shadow-sm hover:shadow transition-all duration-300">
                    <div className="text-2xl font-semibold text-[#2f2f2f] capitalize">
                      {project.status}
                    </div>
                    <div className="text-[#5a5a5a]/80 text-sm mt-1 font-medium">
                      Project Status
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <DashboardCard
              title="Assigned Sprints"
              value={allSprints.length}
              subtitle="Sprints"
              trend={allSprints.length > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Assigned Issues"
              value={assignedIssues.length}
              subtitle="Issues"
              trend={assignedIssues.length > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Estimated Hours"
              value={`${completedEstimatedHours}/${totalEstimatedHours}`}
              subtitle="Completed/Total"
              trend={completedEstimatedHours > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Assigned SubTasks"
              value={assignedSubTasks.length}
              subtitle="SubTasks"
              trend={assignedSubTasks.length > 0 ? "up" : "down"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6">
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-4">
                Assigned Issue Distribution
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-96">
                  <ReusableChart
                    type="doughnut"
                    title="Issues"
                    labels={["Planned", "In Progress", "Done"]}
                    data={[
                      issueCounts.Planned,
                      issueCounts.InProgress,
                      issueCounts.Done,
                    ]}
                    backgroundColors={["#dfdcef", "#9b8dc9", "#009063"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6">
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-4">
                SubTask Progress
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-96">
                  <ReusableChart
                    type="doughnut"
                    title="SubTasks"
                    labels={["Planned", "In Progress", "Done"]}
                    data={[
                      subTaskCounts.Planned,
                      subTaskCounts.InProgress,
                      subTaskCounts.Done,
                    ]}
                    backgroundColors={["#fbfbfb", "#dfdcef", "#009063"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6">
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-4">
                Assigned Sprint Overview
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-96">
                  <ReusableChart
                    type="doughnut"
                    title="Sprints"
                    labels={["Planned", "Active", "Completed"]}
                    data={[
                      sprintCounts.Planned,
                      sprintCounts.Active,
                      sprintCounts.Completed,
                    ]}
                    backgroundColors={["#dfdcef", "#9b8dc9", "#009063"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 lg:p-8 shadow-md border border-[#dfdcef]">
            <h3 className="text-xl lg:text-2xl font-bold mb-5 text-center text-[#3b3b3b] tracking-tight">
              Assigned Project Progress Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Assigned Issues Complete"
                value={
                  assignedIssues.length > 0
                    ? `${Math.round(
                        (issueCounts.Done / assignedIssues.length) * 100
                      )}%`
                    : "0%"
                }
                subtitle="Issues"
                trend={issueCounts.Done > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Hours Completed"
                value={
                  totalEstimatedHours > 0
                    ? `${Math.round(
                        (completedEstimatedHours / totalEstimatedHours) * 100
                      )}%`
                    : "0%"
                }
                subtitle="Hours"
                trend={completedEstimatedHours > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Active Sprints"
                value={allActiveSprints.length}
                subtitle="Sprints"
                trend={allActiveSprints.length > 0 ? "up" : "down"}
              />
              <DashboardCard
                title="Assigned Backlog Issues"
                value={assignedIssues.filter(i => !i.sprintId).length}
                subtitle="Issues"
                trend={assignedIssues.filter(i => !i.sprintId).length > 0 ? "up" : "down"}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold text-[#3b3b3b] mb-6 flex items-center">
            <div className="w-7 h-7 bg-[#dfdcef] rounded flex items-center justify-center mr-2">
              <svg
                className="w-4 h-4 text-[#009063]"
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
              <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                Start Date
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                End Date
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                Active Sprints (Assigned)
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {allActiveSprints.length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                Total Assigned Sprints
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {allSprints.length}
              </p>
            </div>
          </div>
        </div>

        {/* No action buttons for employee; only view assigned content */}

        {/* Assigned Backlog (only assigned issues) */}
        {assignedIssues.filter(i => !i.sprintId).length > 0 && (
          <CollapsibleSection
            title="Assigned Backlog"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0
              102 0V3a2 2 0 012 2v6a2 2 0 01-2
              2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000
              2h2a1 1 0 100-2H7z"
                />
              </svg>
            }
            iconBgColor="bg-[#dfdcef]"
            iconColor="text-[#009063]"
            data={assignedIssues.filter(i => !i.sprintId)}
            type="backlog"
            expandedItem={expandedBacklog}
            setExpandedItem={setExpandedBacklog}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
            onCreateSubTask={openSubTaskModal}
          />
        )}

        {/* Active Sprints (only with assigned issues) */}
        {allActiveSprints.length > 0 && (
          <CollapsibleSection
            title="Active Sprints (Assigned)"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z"
                />
              </svg>
            }
            iconBgColor="bg-[#e6f7f0]"
            iconColor="text-[#009063]"
            data={allActiveSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
            onCreateSubTask={openSubTaskModal}
          />
        )}

        {/* Planned Sprints (only with assigned issues) */}
        {allPlannedSprints.length > 0 && (
          <CollapsibleSection
            title="Planned Sprints (Assigned)"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                />
              </svg>
            }
            iconBgColor="bg-[#dfdcef]"
            iconColor="text-[#3b3b3b]"
            data={allPlannedSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
            onCreateSubTask={openSubTaskModal}
          />
        )}

        {/* Completed Sprints (only with assigned issues) */}
        {allCompletedSprints.length > 0 && (
          <CollapsibleSection
            title="Completed Sprints (Assigned)"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
            }
            iconBgColor="bg-[#e6f7f0]"
            iconColor="text-[#009063]"
            data={allCompletedSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
            onCreateSubTask={openSubTaskModal}
          />
        )}
      </div>

      {/* SubTask Creation Modal */}
      <Modal
        isOpen={isSubTaskModalOpen}
        onClose={closeSubTaskModal}
        title={`Create SubTask for "${selectedIssue?.title || 'Issue'}"`}
      >
        <AuthForm
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          onSubmit={handleCreateSubTask}
          buttonText={submitLoading ? "Creating..." : "Create SubTask"}
          disabled={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default EmployeeProjectDetailsPage;