// components/project/IssueList.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { IssueDTO, UserRole, SubTaskDTO } from "./types";
import { createSubTask, updateIssue } from "@/services/projects";
import { createSubTaskFields } from "../Forms/formFields";
import { createSubTaskSchema } from "@/shared/utils/validations";
import { updateIssueFields } from "../Forms/formFields";
import { updateIssueSchema } from "@/shared/utils/validations";
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";

interface Props {
  issues: IssueDTO[];
  role: UserRole;
}

const IssueList: React.FC<Props> = ({ issues, role }) => {
  const canEdit = role === "company" || role === "manager";
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [updateIssueModalOpen, setUpdateIssueModalOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);
  const [currentIssue, setCurrentIssue] = useState<IssueDTO | null>(null);
  const formRef = useRef<{ resetForm: () => void }>(null);
  const updateFormRef = useRef<{ resetForm: () => void }>(null);

  const toggleExpanded = (issueId: string) => {
    setExpandedIssues((prev) => {
      const newSet = new Set(prev);
      newSet.has(issueId) ? newSet.delete(issueId) : newSet.add(issueId);
      return newSet;
    });
  };

  const hasSubtasks = (issue: IssueDTO) => issue.subTasks?.length > 0;

  // Open subtask modal
  const openSubtaskModal = useCallback((issueId: string) => {
    console.log('Opening subtask modal for issue:', issueId);
    setCurrentIssueId(issueId);
    setIsSubtaskModalOpen(true);
  }, []);

  // Open update issue modal
  const openUpdateIssueModal = useCallback((issue: IssueDTO) => {
    console.log('Opening update modal for issue:', issue.id, issue);
    setCurrentIssue(issue);
    setUpdateIssueModalOpen(true);
  }, []);

  // Close subtask modal
  const closeSubtaskModal = useCallback(() => {
    if (formRef.current?.resetForm) {
      formRef.current.resetForm();
    }
    setIsSubtaskModalOpen(false);
    setCurrentIssueId(null);
  }, []);

  // Close update issue modal
  const closeUpdateIssueModal = useCallback(() => {
    if (updateFormRef.current?.resetForm) {
      updateFormRef.current.resetForm();
    }
    setUpdateIssueModalOpen(false);
    setCurrentIssue(null);
  }, []);

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
      closeSubtaskModal();
      // Optionally refresh the issues list here
    } catch (err: any) {
      console.error("Subtask API Error:", err);
      alert(`Failed to create subtask: ${err.message || 'Unknown error'}`);
    }
  }, [currentIssueId, closeSubtaskModal]);

  const handleUpdateIssue = useCallback(async (values: Record<string, any>) => {
    const payload = { 
      id: currentIssue.id,   // ✅ Pass issue ID  
      ...values 
    };

    console.log(payload);
    
    if (!currentIssue) {
      console.error('No issue set!');
      alert('Error: No issue selected.');
      return;
    }
    try {
      const payload = { ...values, id: currentIssue.id };
      console.log("Update payload", payload);
      await updateIssue(payload);
      alert("Issue updated successfully!");
      closeUpdateIssueModal();
      // Optionally refresh the issues list here
    } catch (err: any) {
      console.error("Update Issue API Error:", err);
      alert(`Failed to update issue: ${err.message || 'Unknown error'}`);
    }
  }, [currentIssue, closeUpdateIssueModal]);

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
        onClose={closeSubtaskModal}
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

      {/* Update Issue Modal */}
      <Modal
        isOpen={updateIssueModalOpen}
        onClose={closeUpdateIssueModal}
        title="Update Issue"
      >
        {currentIssue && (
          <AuthForm
            key={currentIssue.id} // Force re-render when issue changes
            ref={updateFormRef}
            fields={updateIssueFields}
            validationSchema={updateIssueSchema}
            initialValues={currentIssue}
            onSubmit={handleUpdateIssue}
            buttonText="Update Issue"
          />
        )}
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
                  <button 
                    className="flex-1 text-sm border rounded-lg px-4 py-2.5 hover:bg-gray-50 transition"
                    onClick={() => {
                      console.log('Edit Issue button clicked for issue:', issue.id);
                      openUpdateIssueModal(issue);
                    }}
                  >
                    Edit Issue
                  </button>
                  <button className="flex-1 text-sm bg-red-500 text-white rounded-lg px-4 py-2.5 hover:bg-red-600 transition">
                    Delete Issue
                  </button>
                </div>
              )}
            </div>
            {showSubtasksSection && (
              <div className="border-t">
                <div className="p-8 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold">Subtasks</h4>
                    <div className="flex gap-3">
                      {canEdit && (
                        <button
                          className="text-sm bg-[#009063] text-white rounded-lg px-6 py-2.5 hover:bg-[#007a52] transition"
                          onClick={() => openSubtaskModal(issue.id)}
                        >
                          + Create Subtask
                        </button>
                      )}
                      {hasSubtasks(issue) && (
                        <button
                          className="text-sm border rounded-lg px-6 py-2.5 hover:bg-gray-50 transition"
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
                                <button className="text-xs border rounded px-3 py-1.5 hover:bg-gray-50 transition">
                                  Edit
                                </button>
                                <button className="text-xs bg-red-500 text-white rounded px-3 py-1.5 hover:bg-red-600 transition">
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