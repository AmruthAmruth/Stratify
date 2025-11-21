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
  import { createIssueFields, createSprintFields } from "../Forms/formFields";
  import { addEmployeeSchema, createIssueSchema, createSprintSchema } from "@/shared/utils/validations";
  import { createProjectFields } from "../Forms/formFields";
  import { createProjectSchema } from "@/shared/utils/validations";
  import {
    addEmployeetoProject,
    createIssue,
    createSprint,
    getEmployeesNotInProject,
    projectLevelTeamAllocation,
    updateProject, // ⬅️ NEW API CALL
  } from "@/services/projects";
  interface Props {
    project: ProjectDTO;
    role: UserRole;
  }
  const ProjectDetailsLayout: React.FC<Props> = ({ project, role }) => {
    const canManage = role === "company" || role === "manager";
    // ────────────────────────────────
    // MODAL STATES
    // ────────────────────────────────
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isEditProjectModalOpen,setIsEditProjectModalOpen]=useState(false)
    // Refs for AuthForm Reset
    const issueFormRef = useRef<{ resetForm: () => void }>(null);
    const sprintFormRef = useRef<{ resetForm: () => void }>(null);
    const employeeFormRef = useRef<{ resetForm: () => void }>(null);
    const editProjectFormRef=useRef<{resetForm:()=>void}>(null)
    // ────────────────────────────────
    // AVAILABLE EMPLOYEES STATE
    // ────────────────────────────────
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    useEffect(() => {
      getEmployeesNotInProject(project.id).then((data) => {
        
        
        setEmployeeList(data); 
      });
    }, []);
    // ────────────────────────────────
    // CREATE ISSUE
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
    // ────────────────────────────────
    // CREATE SPRINT
    // ────────────────────────────────
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
    // ────────────────────────────────
    // ASSIGN EMPLOYEE TO PROJECT
    // ────────────────────────────────
    const handleSubmitEmployee = async (values: Record<string, any>) => {
      try {
        await addEmployeetoProject({
          projectId: project.id,
          employeeId: values.employeeId,
        });
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
      // Merge new values with project ID
      const updatedData = {
        ...values,
        departmentId:project.departmentId,
        id: project.id,
      };

      console.log("Updating project with:", updatedData);

      // Call API
      const response = await updateProject(updatedData);

      // Success feedback
      alert("Project updated successfully! 🎉");

      // Close modal
      setIsEditProjectModalOpen(false);

      // Reset form
      editProjectFormRef.current?.resetForm();

      // Optional: Refresh project data (if you have a refetch function)
      // await refetchProject(); // uncomment if needed

    } catch (error: any) {
      console.error("Failed to update project:", error);

      // Show user-friendly error
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      alert(`Update failed: ${message}`);
    }
  };
    // ────────────────────────────────
    // DYNAMIC FIELD FOR EMPLOYEE SELECTION
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
    return (
      <div className="space-y-6 p-4 text-black">
        {/* HEADER */}
        <ProjectHeader
          name={project.name}
          keyCode={project.key}
          status={project.status}
          startDate={project.startDate}
          endDate={project.endDate}
          description={project.description}
        />
        {/* ─────────────────────────────── */}
        {/* ADMIN BUTTONS */}
        {/* ─────────────────────────────── */}
        {canManage && (
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={()=>setIsEditProjectModalOpen(true)} className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90">
              Edit Project
            </button>
            {/* ADD EMPLOYEE */}
            <button
              onClick={() => setIsEmployeeModalOpen(true)}
              className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
            >
              Add Employee
            </button>
            <button className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90">
              Assign Issue to Sprint
            </button>
          </div>
        )}
        {/* ─────────────────────────────── */}
        {/* ISSUE MODAL */}
        {/* ─────────────────────────────── */}
        <Modal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          title="Create New Issue"
        >
          <AuthForm
            ref={issueFormRef}
            fields={createIssueFields}
            validationSchema={createIssueSchema}
            onSubmit={handleSubmitIssue}
            buttonText="Create Issue"
          />
        </Modal>
        {/* ─────────────────────────────── */}
        {/* SPRINT MODAL */}
        {/* ─────────────────────────────── */}
        <Modal
          isOpen={isSprintModalOpen}
          onClose={() => setIsSprintModalOpen(false)}
          title="Create New Sprint"
        >
          <AuthForm
            ref={sprintFormRef}
            fields={createSprintFields}
            validationSchema={createSprintSchema}
            onSubmit={handleSubmitSprint}
            buttonText="Create Sprint"
          />
        </Modal>
        {/* ─────────────────────────────── */}
        {/* ADD EMPLOYEE MODAL */}
        {/* ─────────────────────────────── */}
        <Modal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          title="Assign Employee to Project"
        >
          <AuthForm
            ref={employeeFormRef}
            fields={addEmployeeFields}
            validationSchema={addEmployeeSchema} // No validation needed
            onSubmit={handleSubmitEmployee}
            buttonText="Assign Employee"
          />
        </Modal>
  <Modal
  isOpen={isEditProjectModalOpen}
    onClose={() => setIsEditProjectModalOpen(false)}
    title="Update Project"
  >
    <AuthForm
            ref={editProjectFormRef}
            fields={createProjectFields}
            validationSchema={createProjectSchema}
            initialValues={project} // ⬅️ ADDED: Pre-populate with existing project values
            onSubmit={handleSubmitEditProject}
            buttonText="Update Project"
          />
  </Modal>
        {/* BACKLOG */}
        <ProjectSection title="Backlog Items">
          {canManage && (
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-3"
            >
              + Create Issue
            </button>
          )}
          <IssueList issues={project.backlog ?? []} role={role} />
        </ProjectSection>
        {/* ACTIVE SPRINTS */}
        <ProjectSection title="Active Sprints">
          {canManage && (
            <button
              onClick={() => setIsSprintModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded mb-3"
            >
              + Create Sprint
            </button>
          )}
          <SprintList sprints={project.activeSprints ?? []} role={role} />
        </ProjectSection>
        {/* PLANNED */}
        <ProjectSection title="Planned Sprints">
          <SprintList sprints={project.plannedSprints ?? []} role={role} />
        </ProjectSection>
        {/* COMPLETED */}
        <ProjectSection title="Completed Sprints">
          <SprintList sprints={project.completedSprints ?? []} role={role} />
        </ProjectSection>
        {/* EMPLOYEES */}
        <ProjectSection title="Assigned Employees">
          <EmployeeList
            employees={project.assinedEmployee ?? []}
            onRemove={(emp) => console.log("Remove employee:", emp)}
          />
        </ProjectSection>
      </div>
    );
  };
  export default ProjectDetailsLayout;