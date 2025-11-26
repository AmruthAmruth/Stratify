// components/project/ProjectDetailsLayout.tsx
import React, { useState, useRef, useEffect } from "react";
import { ProjectDTO, UserRole } from "./types";
import ProjectHeader from "./ProjectHeader";
import ProjectSection from "./ProjectSection";
import IssueList from "./IssueList";
import SprintList from "./SprintList";
import EmployeeList from "./EmployeeList";
// Modal + Dynamic Form
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";
// Form schemas + other forms
import { createIssueFields, createSprintFields, createProjectFields } from "../Forms/formFields";
import {
  addEmployeeSchema,
  createIssueSchema,
  createSprintSchema,
  assignIssueToSprintSchema,
  createProjectSchema,
} from "@/shared/utils/validations";
import {
  addEmployeetoProject,
  createIssue,
  createSprint,
  getEmployeesNotInProject,
  updateProject,
  assingIssueToSprint,
} from "@/services/projects";
import ReusableChart from "../Chart/ReusableChart";
import DashboardCard from "../DashboardCards/Cards";

interface Props {
  project: ProjectDTO;
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
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isAssignSprintModalOpen, setIsAssignSprintModalOpen] = useState(false);

  // Refs for AuthForm Reset
  const issueFormRef = useRef<{ resetForm: () => void }>(null);
  const sprintFormRef = useRef<{ resetForm: () => void }>(null);
  const employeeFormRef = useRef<{ resetForm: () => void }>(null);
  const editProjectFormRef = useRef<{ resetForm: () => void }>(null);
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
  const assignedEmployees = project.assignedEmployee ?? project.assinedEmployee ?? [];

  // Get all issues from active sprints
  const activeSprintIssues = activeSprints.flatMap((s) => s.issues ?? []);

  // ────────────────────────────────
  // FORM SUBMIT HANDLERS
  // ────────────────────────────────
  const handleSubmitIssue = async (values: Record<string, any>) => {
    try {
      await createIssue({ ...values, projectId: project.id });
      alert("Issue created successfully!");
      issueFormRef.current?.resetForm();
      setIsIssueModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create issue");
    }
  };

  const handleSubmitSprint = async (values: Record<string, any>) => {
    try {
      await createSprint({ ...values, projectId: project.id });
      alert("Sprint created successfully!");
      sprintFormRef.current?.resetForm();
      setIsSprintModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create sprint");
    }
  };

  const handleSubmitEmployee = async (values: Record<string, any>) => {
    try {
      await addEmployeetoProject({ projectId: project.id, employeeId: values.employeeId });
      alert("Employee assigned successfully!");
      employeeFormRef.current?.resetForm();
      setIsEmployeeModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to assign employee");
    }
  };

  const handleSubmitEditProject = async (values: Record<string, any>) => {
    try {
      const updatedData = { ...values, departmentId: project.departmentId, id: project.id };
      await updateProject(updatedData);
      alert("Project updated successfully! 🎉");
      editProjectFormRef.current?.resetForm();
      setIsEditProjectModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (error: any) {
      console.error("Failed to update project:", error);
      const message = error?.response?.data?.message || error?.message || "Something went wrong.";
      alert(`Update failed: ${message}`);
    }
  };

  const handleSubmitAssignSprint = async (values: Record<string, any>) => {
    try {
      await assingIssueToSprint(values);
      alert("Issue assigned to sprint successfully!");
      assignSprintFormRef.current?.resetForm();
      setIsAssignSprintModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to assign issue: ${err.message || "Unknown error"}`);
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
        label: `${emp.name} — ${emp.position}`,
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
          <button onClick={() => setIsEditProjectModalOpen(true)} className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90">
            Edit Project
          </button>
          <button onClick={() => setIsEmployeeModalOpen(true)} className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90">
            Add Employee
          </button>
          <button onClick={() => setIsAssignSprintModalOpen(true)} className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90">
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

      <Modal isOpen={isEditProjectModalOpen} onClose={() => setIsEditProjectModalOpen(false)} title="Update Project">
        <AuthForm ref={editProjectFormRef} fields={createProjectFields} validationSchema={createProjectSchema} initialValues={project} onSubmit={handleSubmitEditProject} buttonText="Update Project" />
      </Modal>

      <Modal isOpen={isAssignSprintModalOpen} onClose={() => setIsAssignSprintModalOpen(false)} title="Assign Issue to Sprint">
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
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
  {/* Sprint Status Summary */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[500px]">
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
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[500px]">
    <ReusableChart
      type="pie"
      title="Backlog Issue Types"
      labels={["User Story", "Bug"]}
      data={[
        backlog.filter((i) => i.type === "User Story").length,
        backlog.filter((i) => i.type === "Bug").length,
      ]}
    />
  </div>

  {/* Issue Status Overview */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[500px]">
    <ReusableChart
      type="pie"
      title="Issue Status Overview"
      labels={["Planned", "In Progress", "Done"]}
      data={[
        backlog.filter((i) => i.status === "Planned").length + activeSprintIssues.filter((i) => i.status === "Planned").length,
        backlog.filter((i) => i.status === "In Progress").length + activeSprintIssues.filter((i) => i.status === "In Progress").length,
        backlog.filter((i) => i.status === "Done").length + activeSprintIssues.filter((i) => i.status === "Done").length,
      ]}
    />
  </div>

  {/* Priority Distribution */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[300px]">
    <ReusableChart
      type="bar"
      title="Priority Breakdown"
      labels={["High", "Medium", "Low"]}
      data={[
        backlog.filter((i) => i.priority === "High").length,
        backlog.filter((i) => i.priority === "Medium").length,
        backlog.filter((i) => i.priority === "Low").length,
      ]}
    />
  </div>

  {/* Assigned Employee Workload */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[300px]">
    <ReusableChart
      type="line"
      title="Employee Workload"
      labels={assignedEmployees.map((emp) => emp.name)}
      data={assignedEmployees.map(
        (emp) =>
          backlog.filter((i) => i.assignedTo === emp.id).length +
          activeSprintIssues.filter((i) => i.assignedTo === emp.id).length
      )}
    />
  </div>

  {/* Hours Estimation Chart */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm w-[500px] h-[300px]">
    <ReusableChart
      type="bar"
      title="Estimated Hours (Backlog)"
      labels={backlog.map((i) => i.heading)}
      data={backlog.map((i) => i.estimatedHours ?? 0)}
    />
  </div>
</div>

{/* ──────────────────────────────── */}
{/* SECTIONS */}
{/* ──────────────────────────────── */}

{/* BACKLOG */}
<ProjectSection title="Backlog Items">
  {canManage && (
    <button onClick={() => setIsIssueModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded mb-3">
      + Create Issue
    </button>
  )}
  <IssueList issues={backlog} role={role} onRefresh={onRefresh} />
</ProjectSection>

{/* ACTIVE SPRINTS */}
<ProjectSection title="Active Sprints">
  {canManage && (
    <button onClick={() => setIsSprintModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded mb-3">
      + Create Sprint
    </button>
  )}
  <SprintList sprints={activeSprints} role={role} />
</ProjectSection>

{/* PLANNED */}
<ProjectSection title="Planned Sprints">
  <SprintList sprints={plannedSprints} role={role} />
</ProjectSection>

{/* COMPLETED */}
<ProjectSection title="Completed Sprints">
  <SprintList sprints={completedSprints} role={role} />
</ProjectSection>

{/* EMPLOYEES */}
<ProjectSection title="Assigned Employees">
  <EmployeeList employees={assignedEmployees} projectId={project.id} onRemove={(emp) => console.log("Remove employee:", emp)} />
</ProjectSection>



    </div>
  );
};

export default ProjectDetailsLayout;
