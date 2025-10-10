import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import CollapsibleSection from "@/shared/components/CollapsibleSection/CollapsibleSection";
import ReusableChart from "@/shared/components/Chart/ReusableChart";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import {
  addEmployeetoProject,
  createIssue,
  createSprint,
  employeeUnderTheProject,
  getEmployeesNotInProject,
  getProjectDetails,
} from "@/services/projects";
import { useParams } from "react-router-dom";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import {
  createIssueFields,
  createSprintFields,
} from "@/shared/components/Forms/formFields";
import {
  createIssueSchema,
  createSprintSchema,
} from "@/shared/utils/validations";
import { enqueueSnackbar } from "notistack";
import * as z from "zod";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ManagerProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [expandedBacklog, setExpandedBacklog] = useState(null);
  const [expandedSprint, setExpandedSprint] = useState(null);
  const [employeeNotInProject, setEmployeeNotInProject] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectData = async (id) => {
      try {
        setLoading(true);
        const data = await getProjectDetails(id);
        const employeeData = await employeeUnderTheProject(id);
        const employeesNotInProject = await getEmployeesNotInProject(id);
        setEmployeeNotInProject(employeesNotInProject);

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

  const handleCreateIssue = async (values) => {
    setSubmitLoading(true);
    try {
      const payload = { ...values, projectId: id };
      await createIssue(payload);
      enqueueSnackbar("Issue created successfully!", { variant: "success" });
      const updatedProject = await getProjectDetails(id);
      setProject(updatedProject);
      setIsBacklogModalOpen(false);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to create issue.", {
        variant: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const createIssueFormFields = [
    ...createIssueFields,
    {
      name: "assignedTo",
      label: "Assign Issue to Team Member",
      type: "select",
      options: [
        { value: "", label: "Select Team Member" },
        ...employees.map((emp) => ({
          value: emp.employeeId,
          label: `${emp.name} - ${emp.position}`,
        })),
      ],
    },
  ];

  const addEmployeeFormFields = [
    {
      name: "employeeId",
      label: "Add Employee to Project",
      type: "select",
      options: [
        { value: "", label: "Select Team Member" },
        ...employeeNotInProject.map((emp) => ({
          value: emp.employeeId,
          label: `${emp.name}`,
        })),
      ],
    },
  ];

  const addEmployeeSchema = z.object({
    employeeId: z.string().min(1, "Please select an employee"),
  });

  const handleCreateSprint = async (values) => {
    setSubmitLoading(true);
    try {
      const payload = { ...values, projectId: id };
      await createSprint(payload);
      enqueueSnackbar("Sprint created successfully!", { variant: "success" });
      const updatedProject = await getProjectDetails(id);
      setProject(updatedProject);
      setIsStoryModalOpen(false);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to create sprint.", {
        variant: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddEmployee = async (values) => {
    setSubmitLoading(true);
    try {
      const payload = { employeeId: values.employeeId, projectId: id };
      await addEmployeetoProject(payload);
      enqueueSnackbar("Employee added successfully!", { variant: "success" });
      const updatedProject = await getProjectDetails(id);
      setProject(updatedProject);
      const employeeData = await employeeUnderTheProject(id);
      if (employeeData && employeeData.employee) {
        setEmployees(employeeData.employee);
      }
      const employeesNotInProject = await getEmployeesNotInProject(id);
      setEmployeeNotInProject(employeesNotInProject);
      setIsEmployeeModalOpen(false);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to add employee.", {
        variant: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenIssueModal = () => {
    setIsBacklogModalOpen(true);
  };

  const handleOpenSprintModal = () => {
    setIsStoryModalOpen(true);
  };

  const handleOpenEmployeeModal = () => {
    setIsEmployeeModalOpen(true);
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

  const allActiveSprints = project.activeSprints || [];
  const allPlannedSprints = project.plannedSprints || [];
  const allCompletedSprints = project.completedSprints || [];
  const allSprints = [
    ...allActiveSprints,
    ...allPlannedSprints,
    ...allCompletedSprints,
  ];
  const allBacklogIssues = project.backlog || [];
  const allSprintIssues = allSprints.flatMap((sprint) => sprint.issues || []);
  const allIssues = [...allBacklogIssues, ...allSprintIssues];
  const allSubTasks = allIssues.flatMap((issue) => issue.subTasks || []);

  const issueCounts = {
    Planned: allIssues.filter((i) => i.status === "Planned").length,
    InProgress: allIssues.filter(
      (i) => i.status === "InProgress" || i.status === "In Progress"
    ).length,
    Done: allIssues.filter(
      (i) => i.status === "Done" || i.status === "Completed"
    ).length,
  };

  const subTaskCounts = {
    Planned: allSubTasks.filter((t) => t.status === "Planned").length,
    InProgress: allSubTasks.filter((t) => t.status === "In Progress").length,
    Done: allSubTasks.filter((t) => t.status === "Done").length,
  };

  const sprintCounts = {
    Planned: allPlannedSprints.length,
    Active: allActiveSprints.length,
    Completed: allCompletedSprints.length,
  };

  const totalEstimatedHours = allIssues.reduce(
    (sum, i) => sum + (i.estimatedHours || 0),
    0
  );
  const completedEstimatedHours = allIssues
    .filter((i) => i.status === "Done" || i.status === "Completed")
    .reduce((sum, i) => sum + (i.estimatedHours || 0), 0);

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="bg-[#fbfbfb] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#e9e6f5] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Project Title and Description */}
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

                {/* Project Status Card */}
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
              title="Total Sprints"
              value={allSprints.length}
              subtitle="Sprints"
              trend={allSprints.length > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Backlog Items"
              value={allBacklogIssues.length}
              subtitle="Issues"
              trend={allBacklogIssues.length > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Estimated Hours"
              value={`${completedEstimatedHours}/${totalEstimatedHours}`}
              subtitle="Completed/Total"
              trend={completedEstimatedHours > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Total Issues"
              value={allIssues.length}
              subtitle="Issues"
              trend={allIssues.length > 0 ? "up" : "down"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6">
              <h3 className="text-xl font-bold text-[#3b3b3b] mb-4">
                Issue Distribution
              </h3>
              <div className="w-full flex items-center justify-center">
                <div className="w-[100%] h-100">
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
                <div className="w-[100%] h-100">
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
                Sprint Overview
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
                    backgroundColors={["#dfdcef", "#9b8dc9", "#009063"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 lg:p-8 shadow-md border border-[#dfdcef]">
            <h3 className="text-xl lg:text-2xl font-bold mb-5 text-center text-[#3b3b3b] tracking-tight">
              Project Progress Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Issues Complete"
                value={
                  allIssues.length > 0
                    ? `${Math.round(
                        (issueCounts.Done / allIssues.length) * 100
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
                title="Backlog Issues"
                value={allBacklogIssues.length}
                subtitle="Issues"
                trend={allBacklogIssues.length > 0 ? "up" : "down"}
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
                Active Sprints
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {project.activeSprintCount || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                Total Sprints
              </p>
              <p className="text-base font-semibold text-[#3b3b3b]">
                {allSprints.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleOpenIssueModal}
            className="px-4 py-2 bg-[#009063] text-white rounded-lg text-sm font-semibold hover:bg-[#007a52] transition-colors duration-200 shadow-sm"
          >
            Create Issue
          </button>
          <button
            onClick={handleOpenSprintModal}
            className="px-4 py-2 bg-[#009063] text-white rounded-lg text-sm font-semibold hover:bg-[#007a52] transition-colors duration-200 shadow-sm"
          >
            Create Sprint
          </button>
          <button
            onClick={handleOpenEmployeeModal}
            className="px-4 py-2 bg-[#009063] text-white rounded-lg text-sm font-semibold hover:bg-[#007a52] transition-colors duration-200 shadow-sm"
          >
            Add Employee
          </button>
        </div>

        {project.backlog && project.backlog.length > 0 && (
          <CollapsibleSection
            title="Backlog"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h2a1 1 0 100-2H7z"
                />
              </svg>
            }
            iconBgColor="bg-[#dfdcef]"
            iconColor="text-[#009063]"
            data={project.backlog}
            type="backlog"
            expandedItem={expandedBacklog}
            setExpandedItem={setExpandedBacklog}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
          />
        )}

        {project.activeSprints && project.activeSprints.length > 0 && (
          <CollapsibleSection
            title="Active Sprints"
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
            data={project.activeSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
          />
        )}

        {project.plannedSprints && project.plannedSprints.length > 0 && (
          <CollapsibleSection
            title="Planned Sprints"
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
            data={project.plannedSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
          />
        )}

        {project.completedSprints && project.completedSprints.length > 0 && (
          <CollapsibleSection
            title="Completed Sprints"
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
            data={project.completedSprints}
            type="sprint"
            expandedItem={expandedSprint}
            setExpandedItem={setExpandedSprint}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getTypeColor={getTypeColor}
          />
        )}
      </div>

      <Modal
        isOpen={isBacklogModalOpen}
        onClose={() => setIsBacklogModalOpen(false)}
        title="Create Issue"
      >
        <AuthForm
          fields={createIssueFormFields}
          validationSchema={createIssueSchema}
          onSubmit={handleCreateIssue}
          buttonText={submitLoading ? "Creating..." : "Create New Issue"}
        />
      </Modal>

      <Modal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        title="Create Sprint"
      >
        <AuthForm
          fields={createSprintFields}
          validationSchema={createSprintSchema}
          onSubmit={handleCreateSprint}
          buttonText={submitLoading ? "Creating..." : "Create Sprint"}
        />
      </Modal>

      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title="Add Employee"
      >
        <AuthForm
          fields={addEmployeeFormFields}
          validationSchema={addEmployeeSchema}
          onSubmit={handleAddEmployee}
          buttonText={submitLoading ? "Adding..." : "Add Employee"}
        />
      </Modal>
    </div>
  );
};

export default ManagerProjectDetailsPage;