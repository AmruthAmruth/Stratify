// components/project/ProjectDetailsLayout.tsx
import React, { useState, useRef } from "react";
import { ProjectDTO, UserRole } from "./types";

import ProjectHeader from "./ProjectHeader";
import ProjectSection from "./ProjectSection";
import IssueList from "./IssueList";
import SprintList from "./SprintList";
import EmployeeList from "./EmployeeList";

// Modal + Form;

// Form fields + validation + API
import { createIssueFields,createSprintFields } from "../Forms/formFields";
import { createIssueSchema,createSprintSchema } from "@/shared/utils/validations";
import { createIssue, createSprint } from "@/services/projects";
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";

interface Props {
  project: ProjectDTO;
  role: UserRole;
}

const ProjectDetailsLayout: React.FC<Props> = ({ project, role }) => {
  const canCreateIssue = role === "company" || role === "manager";

  // --- modal state ---
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // form reference for resetting after submit
  const formRef = useRef<{ resetForm: () => void }>(null);

  // ------------ ISSUE SUBMIT HANDLER -------------
  const handleSubmitIssue = async (values: Record<string, any>) => {
    try {
      const payload = {
        ...values,
        projectId: project.id, // attach project id
      };

      await createIssue(payload);

      alert("Issue created successfully!");

      // reset form
      formRef.current?.resetForm();

      // close modal
      setIsIssueModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create issue");
    }
  };


  const handleSubmitSprint=async(values:Record<string,any>)=>{
    createSprint()
  }

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

      {/* ISSUE MODAL */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Create New Issue"
      >
        <AuthForm
          ref={formRef}
          fields={createIssueFields}
          validationSchema={createIssueSchema}
          onSubmit={handleSubmitIssue}
          buttonText="Create Issue"
        />
      </Modal>

      {/* BACKLOG */}
      <ProjectSection title="Backlog Items">
        {canCreateIssue && (
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-3"
          >
            + Create Issue
          </button>
        )}
        <IssueList issues={project.backlog} role={role} />
      </ProjectSection>

      {/* ACTIVE SPRINTS */}
      <ProjectSection title="Active Sprints">
        {canCreateIssue && (
          <button className="bg-green-600 text-white px-4 py-2 rounded mb-3">
            + Create Sprint
          </button>
        )}
        <SprintList sprints={project.activeSprints} role={role} />
      </ProjectSection>

      {/* PLANNED SPRINTS */}
      <ProjectSection title="Planned Sprints">
        <SprintList sprints={project.plannedSprints} role={role} />
      </ProjectSection>

      {/* COMPLETED SPRINTS */}
      <ProjectSection title="Completed Sprints">
        <SprintList sprints={project.completedSprints} role={role} />
      </ProjectSection>

      {/* EMPLOYEES */}
      <ProjectSection title="Assigned Employees">
        <EmployeeList employees={project.assignedEmployee} />
      </ProjectSection>
    </div>
  );
};

export default ProjectDetailsLayout;
