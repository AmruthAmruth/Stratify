// components/project/ProjectDetailsLayout.tsx
import React, { useState, useRef, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { ProjectDetailsDTO, UserRole } from "./types";
import ProjectHeader from "./ProjectHeader";
import ProjectSection from "./ProjectSection";
import IssueList from "./IssueList";
import SprintList from "./SprintList";
import EmployeeList from "./EmployeeList";
// Modal + Dynamic Form
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";
// Form schemas + other forms
import { createIssueFields, createSprintFields, updateProjectFields } from "../Forms/formFields";
import {
  addEmployeeSchema,
  createIssueSchema,
  createSprintSchema,
  assignIssueToSprintSchema,
  updateProjectSchema,
} from "@/shared/utils/validations";
import {
  addEmployeeProject,
  createIssue,
  createSprint,
  getEmployeesNotInProject,
  updateProject,
  assignIssueToSprint,
  updateIssue,
} from "@/services/projects";
import ReusableChart from "../Chart/ReusableChart";
import DashboardCard from "../DashboardCards/Cards";
import { enqueueSnackbar } from "notistack";

interface Props {
  project: ProjectDetailsDTO; // Changed from ProjectDTO
  role: UserRole;
  onRefresh?: () => Promise<void>;
}

const ProjectDetailsLayout: React.FC<Props> = ({ project, role, onRefresh }) => {
  const canManage = role === "company" || role === "manager";

  // ────────────────────────────────
  // MODAL STATES
  // ────────────────────────────────
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] = useState(false); // Changed from isEditProjectModalOpen
  const [isAssignSprintModalOpen, setIsAssignSprintModalOpen] = useState(false);

  // Refs for AuthForm Reset
  const issueFormRef = useRef<{ resetForm: () => void }>(null);
  const sprintFormRef = useRef<{ resetForm: () => void }>(null);
  const employeeFormRef = useRef<{ resetForm: () => void }>(null);
  const updateProjectFormRef = useRef<{ resetForm: () => void }>(null); // Changed from editProjectFormRef
  const assignSprintFormRef = useRef<{ resetForm: () => void }>(null);

  // ────────────────────────────────
  // AVAILABLE EMPLOYEES STATE
  // ────────────────────────────────
  const [employeeList, setEmployeeList] = useState<any[]>([]);

  useEffect(() => {
    getEmployeesNotInProject(project.id).then((data) => {
      setEmployeeList(data);
    });
  }, [project.id]);

  // ────────────────────────────────
  // SAFE DATA ACCESS HELPERS
  // ────────────────────────────────
  const backlog = project.backlog ?? [];
  const activeSprints = project.activeSprints ?? [];
  const plannedSprints = project.plannedSprints ?? [];
  const completedSprints = project.completedSprints ?? [];
  const assignedEmployees = project.assignedEmployee ?? [];

  // Get all issues from active sprints
  const activeSprintIssues = activeSprints.flatMap((s) => s.issues ?? []);

  // Get all issues across backlog and all sprints
  const allSprintIssues = [
    ...activeSprintIssues,
    ...plannedSprints.flatMap((s) => s.issues ?? []),
    ...completedSprints.flatMap((s) => s.issues ?? []),
  ];
  const allIssues = [...backlog, ...allSprintIssues];

  // ────────────────────────────────
  // FORM SUBMIT HANDLERS
  // ────────────────────────────────
  const handleSubmitIssue = async (values: Record<string, any>) => {
    try {
      await createIssue({ ...values, projectId: project.id });
      enqueueSnackbar("Issue created successfully!", { variant: "success" });
      issueFormRef.current?.resetForm();
      setIsIssueModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to create issue", { variant: "error" });
    }
  };

  const handleSubmitSprint = async (values: Record<string, any>) => {
    try {
      await createSprint({ ...values, projectId: project.id });
      enqueueSnackbar("Sprint created successfully!", { variant: "success" });
      sprintFormRef.current?.resetForm();
      setIsSprintModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to create sprint", { variant: "error" });
    }
  };

  const handleSubmitEmployee = async (values: Record<string, any>) => {
    try {
      await addEmployeeProject({ projectId: project.id, employeeId: values.employeeId }); // Changed function name
      enqueueSnackbar("Employee assigned successfully!", { variant: "success" });
      employeeFormRef.current?.resetForm();
      setIsEmployeeModalOpen(false);
      // Refetch available employees
      getEmployeesNotInProject(project.id).then(setEmployeeList);
      if (onRefresh) await onRefresh();
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.message || "Failed to assign employee", { variant: "error" });
    }
  };

  const handleSubmitUpdateProject = async (values: Record<string, any>) => { // Changed function name
    try {
      const updatedData = { ...values, departmentId: project.departmentId, id: project.id };
      await updateProject(updatedData);
      enqueueSnackbar("Project updated successfully! 🎉", { variant: "success" });
      updateProjectFormRef.current?.resetForm(); // Changed ref
      setIsUpdateProjectModalOpen(false); // Changed modal state
      if (onRefresh) await onRefresh();
    } catch (error: any) {
      console.error("Failed to update project:", error);
      const message = error?.response?.data?.message || error?.message || "Something went wrong.";
      enqueueSnackbar(`Update failed: ${message} `, { variant: "error" });
    }
  };

  const handleSubmitAssignSprint = async (values: Record<string, any>) => {
    try {
      const selectedIssue = backlog.find((issue) => issue.id === values.issueId);
      if (!selectedIssue) {
        enqueueSnackbar("Issue not found", { variant: "error" });
        return;
      }

      // Update the issue with the assigned employee (only changed fields)
      await updateIssue({
        id: values.issueId,
        assignedTo: values.employeeId,
      });

      // Then assign the issue to the sprint
      await assignIssueToSprint({
        issueId: values.issueId,
        sprintId: values.sprintId,
      });

      enqueueSnackbar("Issue assigned to sprint successfully!", { variant: "success" });
      assignSprintFormRef.current?.resetForm();
      setIsAssignSprintModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to assign issue", { variant: "error" });
    }
  };

  // ────────────────────────────────
  // DRAG AND DROP HANDLER
  // ────────────────────────────────
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const issueId = active.id as string;
    const sprintId = over.id as string;

    try {
      // Assign issue to sprint without requiring employee
      await assignIssueToSprint({
        issueId,
        sprintId,
      });

      enqueueSnackbar("Issue assigned to sprint successfully!", { variant: "success" });

      // Refresh project data to show updated state
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Failed to assign issue to sprint", { variant: "error" });
    }
  };

  // ────────────────────────────────
  // DYNAMIC FORM FIELDS
  // ────────────────────────────────
  const addEmployeeFields = [
    {
      name: "employeeId",
      label: "Select Employee",
      type: "select",
      placeholder: "Choose employee",
      options: employeeList.map((emp) => ({
        label: `${emp.name} — ${emp.position} `,
        value: emp.employeeId,
      })),
    },
  ];

  const assignIssueToSprintFields = [
    {
      name: "issueId",
      label: "Select Issue",
      type: "select",
      placeholder: "Choose issue",
      options: backlog.map((issue) => ({
        label: `${issue.heading} (${issue.priority})`,
        value: issue.id,
      })),
    },
    {
      name: "employeeId",
      label: "Assign to Employee",
      type: "select",
      placeholder: "Choose employee",
      options: assignedEmployees.map((emp) => ({
        label: `${emp.name} — ${emp.position} `,
        value: emp.id,
      })),
    },
    {
      name: "sprintId",
      label: "Select Sprint",
      type: "select",
      placeholder: "Choose sprint",
      options: [...activeSprints, ...plannedSprints].map((sprint) => ({
        label: `${sprint.name} (${sprint.status})`,
        value: sprint.id,
      })),
    },
  ];

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="space-y-6 p-4 text-black">
      {/* --- HEADER --- */}
      <ProjectHeader
        name={project.name}
        keyCode={project.key}
        status={project.status}
        startDate={project.startDate}
        endDate={project.endDate}
        description={project.description}
      />

      {/* --- ADMIN BUTTONS --- */}
      {canManage && (
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setIsUpdateProjectModalOpen(true)}
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
            aria-label="Edit project details"
          >
            Edit Project
          </button>
          <button
            onClick={() => setIsEmployeeModalOpen(true)}
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
            aria-label="Add employee to project"
          >
            Add Employee
          </button>
          <button
            onClick={() => setIsAssignSprintModalOpen(true)}
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
            aria-label="Assign issue to sprint and employee"
          >
            Assign Issue to Sprint
          </button>
        </div>
      )}

      {/* --- MODALS --- */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Create New Issue">
        <AuthForm ref={issueFormRef} fields={createIssueFields} validationSchema={createIssueSchema} onSubmit={handleSubmitIssue} buttonText="Create Issue" />
      </Modal>

      <Modal isOpen={isSprintModalOpen} onClose={() => setIsSprintModalOpen(false)} title="Create New Sprint">
        <AuthForm ref={sprintFormRef} fields={createSprintFields} validationSchema={createSprintSchema} onSubmit={handleSubmitSprint} buttonText="Create Sprint" />
      </Modal>

      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} title="Assign Employee to Project">
        <AuthForm ref={employeeFormRef} fields={addEmployeeFields} validationSchema={addEmployeeSchema} onSubmit={handleSubmitEmployee} buttonText="Assign Employee" />
      </Modal>

      <Modal isOpen={isUpdateProjectModalOpen} onClose={() => setIsUpdateProjectModalOpen(false)} title="Update Project">
        <AuthForm
          ref={updateProjectFormRef}
          fields={updateProjectFields}
          validationSchema={updateProjectSchema}
          initialValues={project}
          onSubmit={handleSubmitUpdateProject}
          buttonText="Update Project"
        />
      </Modal>

      <Modal isOpen={isAssignSprintModalOpen} onClose={() => setIsAssignSprintModalOpen(false)} title="Assign Issue to Sprint & Employee">
        <AuthForm ref={assignSprintFormRef} fields={assignIssueToSprintFields} validationSchema={assignIssueToSprintSchema} onSubmit={handleSubmitAssignSprint} buttonText="Assign to Sprint" />
      </Modal>

      {/* ──────────────────────────────── */}
      {/* DASHBOARD CARDS */}
      {/* ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <DashboardCard title="Total Backlogs" value={project.backlog.length} subtitle="Issues waiting" badge="Backlog" />
        <DashboardCard title="Planned Sprints" value={project.plannedSprintCount} subtitle="Upcoming work" trend="up" badge="Planned" />
        <DashboardCard title="Active Sprints" value={project.activeSprintCount} subtitle="Currently active" trend="up" badge="Active" />
        <DashboardCard title="Completed Sprints" value={project.completedSprintCount} subtitle="Completed cycles" trend="down" badge="Done" />
      </div>

      {/* ──────────────────────────────── */}
      {/* CHARTS */}
      {/* ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {/* Sprint Status Summary */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[400px]">
          <ReusableChart
            type="doughnut"
            title="Sprint Overview"
            labels={["Planned", "Active", "Completed"]}
            data={[
              project.plannedSprintCount ?? 0,
              project.activeSprintCount ?? 0,
              project.completedSprintCount ?? 0,
            ]}
          />
        </div>

        {/* Issue Type Distribution */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[400px]">
          <ReusableChart
            type="pie"
            title="All Issue Types"
            labels={["User Story", "Bug"]}
            data={[
              allIssues.filter((i) => i.type === "User Story").length,
              allIssues.filter((i) => i.type === "Bug").length,
            ]}
          />
        </div>

        {/* Issue Status Overview */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[400px]">
          <ReusableChart
            type="pie"
            title="Issue Status Overview"
            labels={["Planned", "In Progress", "Done"]}
            data={[
              allIssues.filter((i) => i.status === "Planned").length,
              allIssues.filter((i) => i.status === "In Progress").length,
              allIssues.filter((i) => i.status === "Done").length,
            ]}
          />
        </div>

        {/* Priority Distribution */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[350px]">
          <ReusableChart
            type="bar"
            title="Priority Breakdown"
            labels={["High", "Medium", "Low"]}
            data={[
              allIssues.filter((i) => i.priority === "High").length,
              allIssues.filter((i) => i.priority === "Medium").length,
              allIssues.filter((i) => i.priority === "Low").length,
            ]}
          />
        </div>

        {/* Assigned Employee Workload */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[350px]">
          <ReusableChart
            type="line"
            title="Employee Workload"
            labels={assignedEmployees.map((emp) => emp.name)}
            data={assignedEmployees.map(
              (emp) =>
                allIssues.filter((i) => i.assignedTo === emp.id).length
            )}
          />
        </div>

        {/* Hours Estimation Chart */}
        <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-full h-[350px]">
          <ReusableChart
            type="bar"
            title="Estimated Hours (All Issues)"
            labels={allIssues.map((i) => (i.heading.length > 20 ? `${i.heading.slice(0, 20)}...` : i.heading))}
            data={allIssues.map((i) => i.estimatedHours ?? 0)}
          />
        </div>
      </div>

      {/* ──────────────────────────────── */}
      {/* SECTIONS */}
      {/* ──────────────────────────────── */}

      {/* Wrap backlog and sprints in DndContext for drag-and-drop */}
      <DndContext onDragEnd={handleDragEnd}>
        {/* BACKLOG */}
        <ProjectSection title="Backlog Items">
          {canManage && (
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-3"
              aria-label="Create new issue"
            >
              + Create Issue
            </button>
          )}
          <IssueList issues={backlog} role={role} onRefresh={onRefresh} employees={assignedEmployees} />
        </ProjectSection>

        {/* ACTIVE SPRINTS */}
        <ProjectSection title="Active Sprints">
          {canManage && (
            <button
              onClick={() => setIsSprintModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded mb-3"
              aria-label="Create new sprint"
            >
              + Create Sprint
            </button>
          )}
          <SprintList sprints={activeSprints} role={role} employees={assignedEmployees} />
        </ProjectSection>

        {/* PLANNED */}
        <ProjectSection title="Planned Sprints">
          <SprintList sprints={plannedSprints} role={role} employees={assignedEmployees} />
        </ProjectSection>
      </DndContext>

      {/* COMPLETED (outside DndContext - no drag-drop needed) */}
      <ProjectSection title="Completed Sprints">
        <SprintList sprints={completedSprints} role={role} employees={assignedEmployees} />
      </ProjectSection>

      {/* EMPLOYEES */}
      <ProjectSection title="Assigned Employees">
        <EmployeeList employees={assignedEmployees} projectId={project.id} />
      </ProjectSection>
    </div>
  );
};

export default ProjectDetailsLayout;