// components/project/IssueList.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const canEdit = role === "company" || role === "manager"; // adjust if using enum
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);
  const formRef = useRef<{ resetForm: () => void }>(null);

  const toggleExpanded = (issueId: string) => {
    setExpandedIssues((prev) => {
      const newSet = new Set(prev);
      newSet.has(issueId) ? newSet.delete(issueId) : newSet.add(issueId);
      return newSet;
    });
  };

  const hasSubtasks = (issue: IssueDTO) => issue.subTasks?.length > 0;

  // Combined state updater for opening modal
  const openSubtaskModal = useCallback((issueId: string) => {
    console.log('Opening modal for issue:', issueId);
    setCurrentIssueId(issueId);
    setIsSubtaskModalOpen(true);
  }, []);

  // Effect to log state sync (for debugging; remove in production)
  useEffect(() => {
    if (isSubtaskModalOpen && currentIssueId) {
      console.log('Modal open with ID:', currentIssueId);
    }
  }, [isSubtaskModalOpen, currentIssueId]);

  const handleSubmitSubTask = useCallback(async (values: Record<string, any>) => {
    console.log('handleSubmitSubTask invoked!', { values, currentIssueId });
    if (!currentIssueId) {
      console.error('No issueId set!');
      alert('Error: No parent issue selected.');
      return;
    }
    try {
      const payload = { ...values, issueId: currentIssueId };
      console.log("Subtask payload", payload);
      await createSubTask(payload);
      alert("Subtask created successfully!");
      if (formRef.current?.resetForm) {
        formRef.current.resetForm();
      }
      setIsSubtaskModalOpen(false);
      setCurrentIssueId(null);
    } catch (err) {
      console.error("Subtask API Error:", err);
      alert(`Failed to create subtask: ${err.message || 'Unknown error'}`);
    }
  }, [currentIssueId]);

  // Wrapped onSubmit to add logging before calling the actual handler
  const wrappedOnSubmit = useCallback((values: Record<string, any>) => {
    console.log('AuthForm onSubmit called with values:', values);
    handleSubmitSubTask(values);
  }, [handleSubmitSubTask]);

  if (!issues.length) {
    return (
      <div className="text-center py-16 bg-[#fbfbfb] rounded-2xl border border-[#dfdcef] shadow-sm">
        <p className="text-xl text-[#3b3b3b]/60 font-light">No issues found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Subtask Modal */}
      <Modal
        isOpen={isSubtaskModalOpen}
        onClose={() => {
          if (formRef.current?.resetForm) {
            formRef.current.resetForm();
          }
          setIsSubtaskModalOpen(false);
          setCurrentIssueId(null);
        }}
        title="Create New Subtask"
      >
        <AuthForm
          ref={formRef}
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          onSubmit={wrappedOnSubmit}
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
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold">{issue.heading}</h3>
                <span className="text-xs font-semibold bg-[#009063] text-white px-3 py-1 rounded-full">
                  {issue.priority}
                </span>
              </div>
              <p className="text-base text-[#3b3b3b]/80">{issue.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60">Type</span>
                  <span className="block text-sm font-medium capitalize">
                    {issue.type}
                  </span>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60">Status</span>
                  <span className="block text-sm font-semibold text-[#009063] capitalize">
                    {issue.status}
                  </span>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60">Size</span>
                  <span className="block text-sm font-medium">{issue.size}</span>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60">Est. Hours</span>
                  <span className="block text-sm font-medium">
                    {issue.estimatedHours}
                  </span>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-3 pt-2 border-t">
                  <button className="flex-1 text-sm border rounded-lg px-4 py-2.5">
                    Edit Issue
                  </button>
                  <button className="flex-1 text-sm bg-red-500 text-white rounded-lg px-4 py-2.5">
                    Delete Issue
                  </button>
                </div>
              )}
            </div>
            {showSubtasksSection && (
              <div className="border-t">
                <div className="p-8 pt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold">Subtasks</h4>
                    <div className="flex gap-3">
                      {canEdit && (
                        <button
                          className="text-sm bg-[#009063] text-white rounded-lg px-6 py-2.5"
                          onClick={() => openSubtaskModal(issue.id)}
                        >
                          + Create Subtask
                        </button>
                      )}
                      {hasSubtasks(issue) && (
                        <button
                          className="text-sm border rounded-lg px-6 py-2.5"
                          onClick={() => toggleExpanded(issue.id)}
                        >
                          {isExpanded ? "− Hide" : "+ Show"} Subtasks
                        </button>
                      )}
                    </div>
                  </div>
                  {hasSubtasks(issue) && isExpanded ? (
                    <div className="space-y-4 pt-4 border-t">
                      {issue.subTasks!.map((sub: SubTaskDTO) => (
                        <div
                          key={sub.id}
                          className="bg-white border rounded-lg p-6 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-lg font-medium flex-1">{sub.heading}</p>
                            <span className="text-xs font-semibold bg-[#009063]/80 text-white px-3 py-1 rounded-full">
                              {sub.status}
                            </span>
                          </div>
                          <p className="text-sm text-[#3b3b3b]/80">{sub.description}</p>
                          <div className="flex justify-between items-center border-t pt-2">
                            <span className="text-sm text-[#3b3b3b]/70">
                              Hours:{" "}
                              <span className="font-semibold text-[#3b3b3b]">{sub.hours}</span>
                            </span>
                            {canEdit && (
                              <div className="flex gap-2">
                                <button className="text-xs border rounded px-3 py-1.5">
                                  Edit
                                </button>
                                <button className="text-xs bg-red-500 text-white rounded px-3 py-1.5">
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    canEdit && <p className="text-sm text-[#3b3b3b]/60 pt-2">No subtasks yet.</p>
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