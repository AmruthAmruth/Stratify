// components/project/IssueList.tsx
import React, { useState, useRef } from "react";
import { IssueDTO, UserRole, SubTaskDTO } from "./types";
import { createSubTask } from "@/services/projects";

import { createSubTaskFields } from "../Forms/formFields";
import { createSubTaskSchema } from "@/shared/utils/validations";

import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";

interface Props {
  issues: IssueDTO[];
  role: UserRole;
}

const IssueList: React.FC<Props> = ({ issues, role }) => {
  const canEdit = role === "company" || role === "manager";

  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  // ---------------- CREATE SUBTASK MODAL ----------------
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);

  const formRef = useRef<{ resetForm: () => void }>(null);

  const toggleExpanded = (issueId: string) => {
    setExpandedIssues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) newSet.delete(issueId);
      else newSet.add(issueId);
      return newSet;
    });
  };

  const hasSubtasks = (issue: IssueDTO) =>
    issue.subTasks && issue.subTasks.length > 0;

  // ---------------- SUBTASK SUBMIT HANDLER ----------------
  const handleSubmitSubTask = async (values: Record<string, any>) => {
    try {
      console.log("Worked here as well");
      
      if (!currentIssueId) return;

      const payload = {
        ...values,
        issueId: currentIssueId,
      };
  console.log("subtask palyload",payload);
  
      // await createSubTask(payload);

      alert("Subtask created successfully!");

      formRef.current?.resetForm();
      setIsSubtaskModalOpen(false);
      setCurrentIssueId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create subtask");
    }
  };

  if (!issues.length) {
    return (
      <div className="text-center py-16 bg-[#fbfbfb] rounded-2xl border border-[#dfdcef] shadow-sm">
        <p className="text-xl text-[#3b3b3b]/60 font-light leading-relaxed">
          No issues found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ---------------- MODAL FOR CREATE SUBTASK ---------------- */}
      <Modal
        isOpen={isSubtaskModalOpen}
        onClose={() => {
          setIsSubtaskModalOpen(false);
          setCurrentIssueId(null);
        }}
        title="Create New Subtask"
      >
        <AuthForm
          ref={formRef}
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          onSubmit={handleSubmitSubTask}
          buttonText="Create Subtask"
        />
      </Modal>

      {issues.map((issue) => {
        const isExpanded = expandedIssues.has(issue.id);
        const showSubtasksSection = canEdit || hasSubtasks(issue);

        return (
          <section
            key={issue.id}
            className="bg-[#fbfbfb] rounded-2xl border border-[#dfdcef] shadow-sm overflow-hidden"
          >
            <div className="p-8 space-y-6">
              {/* Issue Header */}
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-2xl font-semibold text-[#3b3b3b] leading-tight">
                  {issue.heading}
                </h3>
                <span className="inline-block text-xs font-semibold uppercase text-white bg-[#009063] px-3 py-1 rounded-full">
                  {issue.priority}
                </span>
              </div>

              {/* Issue Description */}
              <p className="text-base text-[#3b3b3b]/80 leading-relaxed">
                {issue.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#dfdcef] rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60 block mb-1">Type</span>
                  <span className="text-sm font-medium text-[#3b3b3b] capitalize">{issue.type}</span>
                </div>
                <div className="bg-white border border-[#dfdcef] rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60 block mb-1">Status</span>
                  <span className="text-sm font-semibold text-[#009063] capitalize">{issue.status}</span>
                </div>
                <div className="bg-white border border-[#dfdcef] rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60 block mb-1">Size</span>
                  <span className="text-sm font-medium text-[#3b3b3b]">{issue.size}</span>
                </div>
                <div className="bg-white border border-[#dfdcef] rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60 block mb-1">Est. Hours</span>
                  <span className="text-sm font-medium text-[#3b3b3b]">{issue.estimatedHours}</span>
                </div>
              </div>

              {/* Controls */}
              {canEdit && (
                <div className="flex gap-3 pt-2 border-t border-[#dfdcef]">
                  <button className="flex-1 text-sm font-medium text-[#3b3b3b] border border-[#dfdcef] rounded-lg px-4 py-2.5">
                    Edit Issue
                  </button>
                  <button className="flex-1 text-sm font-medium text-white bg-red-500 rounded-lg px-4 py-2.5">
                    Delete Issue
                  </button>
                </div>
              )}
            </div>

            {/* Subtasks */}
            {showSubtasksSection && (
              <div className="border-t border-[#dfdcef]">
                <div className="p-8 pt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold text-[#3b3b3b]">Subtasks</h4>

                    <div className="flex gap-3">
                      {canEdit && (
                        <button
                          className="text-sm font-medium text-white bg-[#009063] rounded-lg px-6 py-2.5"
                          onClick={() => {
                            setCurrentIssueId(issue.id);
                            setIsSubtaskModalOpen(true);
                          }}
                        >
                          + Create Subtask
                        </button>
                      )}

                      {hasSubtasks(issue) && (
                        <button
                          className="text-sm font-medium text-[#3b3b3b] border border-[#dfdcef] rounded-lg px-6 py-2.5"
                          onClick={() => toggleExpanded(issue.id)}
                        >
                          {isExpanded ? "− Hide" : "+ Show"} Subtasks
                        </button>
                      )}
                    </div>
                  </div>

                  {hasSubtasks(issue) && isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-[#dfdcef]">
                      {issue.subTasks.map((sub: SubTaskDTO) => (
                        <div
                          key={sub.id}
                          className="bg-white border border-[#dfdcef] rounded-lg p-6 space-y-3"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-lg font-medium text-[#3b3b3b] leading-tight flex-1">
                              {sub.heading}
                            </p>
                            <span className="inline-block text-xs font-semibold uppercase text-white bg-[#009063]/80 px-3 py-1 rounded-full">
                              {sub.status}
                            </span>
                          </div>

                          <p className="text-sm text-[#3b3b3b]/80 leading-relaxed">
                            {sub.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-[#dfdcef]">
                            <span className="text-sm text-[#3b3b3b]/70 font-medium">
                              Hours:{" "}
                              <span className="text-[#3b3b3b] font-semibold">
                                {sub.hours}
                              </span>
                            </span>

                            {canEdit && (
                              <div className="flex gap-2">
                                <button className="text-xs font-medium text-[#3b3b3b] border border-[#dfdcef] rounded px-3 py-1.5">
                                  Edit
                                </button>
                                <button className="text-xs font-medium text-white bg-red-500 rounded px-3 py-1.5">
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default IssueList;
