// components/project/ProjectDetailsLayout.tsx
import React, { useState, useRef } from "react";
import { ProjectDTO, UserRole } from "./types";

import ProjectHeader from "./ProjectHeader";
import ProjectSection from "./ProjectSection";
import IssueList from "./IssueList";
import SprintList from "./SprintList";
import EmployeeList from "./EmployeeList";

// Modal + dynamic form
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";

// Form fields + schemas + API calls
import { createIssueFields, createSprintFields } from "../Forms/formFields";
import { createIssueSchema, createSprintSchema } from "@/shared/utils/validations";
import { createIssue, createSprint } from "@/services/projects";

interface Props {
  project: ProjectDTO;
  role: UserRole;
}

const ProjectDetailsLayout: React.FC<Props> = ({ project, role }) => {
  const canManage = role === "company" || role === "manager";

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

  const issueFormRef = useRef<{ resetForm: () => void }>(null);
  const sprintFormRef = useRef<{ resetForm: () => void }>(null);

  // -------- CREATE ISSUE ----------
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

  // -------- CREATE SPRINT ----------
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

      {/* ----- ADMIN BUTTONS ----- */}
      {canManage && (
        <div className="flex flex-wrap gap-3 mt-4">

          {/* Edit Project */}
          <button
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
          >
            Edit Project
          </button>

          {/* Add Employee */}
          <button
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
          >
            Add Employee
          </button>

          {/* Assign Issue to Sprint */}
          <button
            className="px-4 py-2 rounded-lg text-white bg-[#009063] hover:opacity-90"
          >
            Assign Issue to Sprint
          </button>
        </div>
      )}

      {/* ISSUE MODAL */}
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

      {/* SPRINT MODAL */}
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
