// components/project/IssueList.tsx
import React, { useState, useRef, useCallback } from "react";
import { IssueDTO, UserRole } from "./types";
import { createSubTask, deleteIssue, updateIssue, updateTask, deleteSubTask } from "@/services/projects";
import { createSubTaskFields, updateIssueFields, updateSubTaskFields } from "../Forms/formFields";
import { createSubTaskSchema, updateIssueSchema, updateSubTaskSchema } from "@/shared/utils/validations";
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { enqueueSnackbar } from "notistack";

interface Props {
  issues: IssueDTO[];
  role: UserRole;
  onRefresh?: () => Promise<void>;
}

const IssueList: React.FC<Props> = ({ issues, role, onRefresh }) => {
  const canEdit = role === "company" || role === "manager";
  const [expandedIssues, setExpandedIssues] = useState(new Set());
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [updateIssueModalOpen, setUpdateIssueModalOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);
  const [currentIssue, setCurrentIssue] = useState<IssueDTO | null>(null);

  const [updateSubTaskModalOpen, setUpdateSubTaskModalOpen] = useState(false);
  const [currentSubTask, setCurrentSubTask] = useState<any | null>(null);

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });

  const formRef = useRef<{ resetForm: () => void }>(null);
  const updateFormRef = useRef<{ resetForm: () => void }>(null);
  const updateSubTaskFormRef = useRef<{ resetForm: () => void }>(null);

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
    setCurrentIssueId(issueId);
    setIsSubtaskModalOpen(true);
  }, []);

  // Open update modal
  const openUpdateIssueModal = useCallback((issue: IssueDTO) => {
    setCurrentIssue(issue);
    setUpdateIssueModalOpen(true);
  }, []);

  const closeSubtaskModal = useCallback(() => {
    formRef.current?.resetForm?.();
    setIsSubtaskModalOpen(false);
    setCurrentIssueId(null);
  }, []);

  const closeUpdateIssueModal = useCallback(() => {
    updateFormRef.current?.resetForm?.();
    setUpdateIssueModalOpen(false);
    setCurrentIssue(null);
  }, []);

  const openUpdateSubTaskModal = useCallback((subTask: any) => {
    setCurrentSubTask(subTask);
    setUpdateSubTaskModalOpen(true);
  }, []);

  const closeUpdateSubTaskModal = useCallback(() => {
    updateSubTaskFormRef.current?.resetForm?.();
    setUpdateSubTaskModalOpen(false);
    setCurrentSubTask(null);
  }, []);

  // Create Subtask
  const handleCreateSubtask = useCallback(
    async (values: Record<string, any>) => {
      if (!currentIssueId) {
        enqueueSnackbar("No issue selected", { variant: "error" });
        return;
      }

      try {
        const payload = { ...values, issueId: currentIssueId };
        await createSubTask(payload);
        enqueueSnackbar("Subtask created successfully!", { variant: "success" });
        closeSubtaskModal();
        if (onRefresh) await onRefresh();
      } catch (err: any) {
        enqueueSnackbar(err.message || "Failed to create subtask", { variant: "error" });
      }
    },
    [currentIssueId, closeSubtaskModal, onRefresh]
  );

  // Update Issue
  const handleUpdateIssue = useCallback(
    async (values: Record<string, any>) => {
      if (!currentIssue) {
        enqueueSnackbar("No issue selected", { variant: "error" });
        return;
      }

      try {
        const payload = { ...values, id: currentIssue.id };
        await updateIssue(payload);
        enqueueSnackbar("Issue updated successfully!", { variant: "success" });
        closeUpdateIssueModal();
        if (onRefresh) await onRefresh();
      } catch (err: any) {
        enqueueSnackbar(err.message || "Failed to update issue", { variant: "error" });
      }
    },
    [currentIssue, closeUpdateIssueModal, onRefresh]
  );

  // DELETE ISSUE
  const handleDeleteIssue = (issueId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Issue",
      message: "Are you sure you want to delete this issue? This action cannot be undone.",
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await deleteIssue(issueId);
          enqueueSnackbar("Issue deleted successfully!", { variant: "success" });
          if (onRefresh) await onRefresh();
        } catch (err: any) {
          enqueueSnackbar(err.message || "Failed to delete issue", { variant: "error" });
        }
      },
    });
  };

  // Update Subtask
  const handleUpdateSubTask = useCallback(
    async (values: Record<string, any>) => {
      if (!currentSubTask) {
        enqueueSnackbar("No subtask selected", { variant: "error" });
        return;
      }

      try {
        const payload = { ...values, id: currentSubTask.id };
        await updateTask(payload);
        enqueueSnackbar("Subtask updated successfully!", { variant: "success" });
        closeUpdateSubTaskModal();
        if (onRefresh) await onRefresh();
      } catch (err: any) {
        enqueueSnackbar(err.message || "Failed to update subtask", { variant: "error" });
      }
    },
    [currentSubTask, closeUpdateSubTaskModal, onRefresh]
  );

  // Delete Subtask
  const handleDeleteSubTask = (subTaskId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Subtask",
      message: "Are you sure you want to delete this subtask? This action cannot be undone.",
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await deleteSubTask(subTaskId);
          enqueueSnackbar("Subtask deleted successfully!", { variant: "success" });
          if (onRefresh) await onRefresh();
        } catch (err: any) {
          enqueueSnackbar(err.message || "Failed to delete subtask", { variant: "error" });
        }
      },
    });
  };

  if (!issues.length) {
    return (
      <div className="text-center py-16 bg-[#fbfbfb] rounded-2xl border border-[#dfdcef] shadow-sm">
        <p className="text-xl text-[#3b3b3b]/60 font-light">No issues found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Create Subtask Modal */}
      <Modal isOpen={isSubtaskModalOpen} onClose={closeSubtaskModal} title="Create Subtask">
        <AuthForm
          key={`create-subtask-${currentIssueId}`}
          ref={formRef}
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          initialValues={{}}
          onSubmit={handleCreateSubtask}
          buttonText="Create Subtask"
        />
      </Modal>

      {/* Update Issue Modal */}
      <Modal isOpen={updateIssueModalOpen} onClose={closeUpdateIssueModal} title="Update Issue">
        {currentIssue && (
          <AuthForm
            key={currentIssue.id}
            ref={updateFormRef}
            fields={updateIssueFields}
            validationSchema={updateIssueSchema}
            initialValues={currentIssue}
            onSubmit={handleUpdateIssue}
            buttonText="Update Issue"
          />
        )}
      </Modal>

      {/* Update Subtask Modal */}
      <Modal isOpen={updateSubTaskModalOpen} onClose={closeUpdateSubTaskModal} title="Update Subtask">
        {currentSubTask && (
          <AuthForm
            key={currentSubTask.id}
            ref={updateSubTaskFormRef}
            fields={updateSubTaskFields}
            validationSchema={updateSubTaskSchema}
            initialValues={currentSubTask}
            onSubmit={handleUpdateSubTask}
            buttonText="Update Subtask"
          />
        )}
      </Modal>

      {/* Issue List */}
      {issues.map((issue) => {
        const isExpanded = expandedIssues.has(issue.id);
        const showSubtasks = canEdit || hasSubtasks(issue);

        return (
          <section key={issue.id} className="bg-[#fbfbfb] rounded-2xl border border-[#dfdcef] shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">

              {/* Header */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold">{issue.heading}</h3>
                <span className="text-xs font-semibold bg-[#009063] text-white px-3 py-1 rounded-full">
                  {issue.priority}
                </span>
              </div>

              <p className="text-base text-[#3b3b3b]/80">{issue.description}</p>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-3">
                  <span className="text-xs text-[#3b3b3b]/60">Type</span>
                  <span className="block text-sm font-medium capitalize">{issue.type}</span>
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
                  <span className="block text-sm font-medium">{issue.estimatedHours}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="flex gap-3 pt-2 border-t">

                  <button
                    className="flex-1 text-sm border rounded-lg px-4 py-2.5 hover:bg-gray-50"
                    onClick={() => openUpdateIssueModal(issue)}
                  >
                    Edit Issue
                  </button>

                  {/* FIXED DELETE BUTTON */}
                  <button
                    className="flex-1 text-sm bg-red-500 text-white rounded-lg px-4 py-2.5 hover:bg-red-600"
                    onClick={() => handleDeleteIssue(issue.id)}
                  >
                    Delete Issue
                  </button>

                </div>
              )}
            </div>

            {/* Subtasks */}
            {showSubtasks && (
              <div className="border-t p-8 pt-6 space-y-4">

                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold">Subtasks</h4>

                  <div className="flex gap-3">
                    {canEdit && (
                      <button
                        className="text-sm bg-[#009063] text-white rounded-lg px-6 py-2.5 hover:bg-[#007a52]"
                        onClick={() => openSubtaskModal(issue.id)}
                      >
                        + Create Subtask
                      </button>
                    )}

                    {hasSubtasks(issue) && (
                      <button
                        className="text-sm border rounded-lg px-6 py-2.5 hover:bg-gray-50"
                        onClick={() => toggleExpanded(issue.id)}
                      >
                        {isExpanded ? "− Hide" : "+ Show"} Subtasks
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtask List */}
                {hasSubtasks(issue) && isExpanded ? (
                  <div className="space-y-4 pt-4 border-t">
                    {issue.subTasks!.map((sub) => (
                      <div key={sub.id} className="bg-white border rounded-lg p-6 space-y-3">

                        <div className="flex justify-between items-start">
                          <p className="text-lg font-medium">{sub.heading}</p>
                          <span className="text-xs font-semibold bg-[#009063]/80 text-white px-3 py-1 rounded-full">
                            {sub.status}
                          </span>
                        </div>

                        <p className="text-sm text-[#3b3b3b]/80">{sub.description}</p>

                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-sm text-[#3b3b3b]/70">
                            Hours: <span className="font-semibold">{sub.hours}</span>
                          </span>

                          {canEdit && (
                            <div className="flex gap-2">
                              <button
                                className="text-xs border rounded px-3 py-1.5 hover:bg-gray-50"
                                onClick={() => openUpdateSubTaskModal(sub)}
                              >
                                Edit
                              </button>

                              <button
                                className="text-xs bg-red-500 text-white rounded px-3 py-1.5 hover:bg-red-600"
                                onClick={() => handleDeleteSubTask(sub.id)}
                              >
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
            )}
          </section>
        );
      })}
    </div>
  );
};

export default IssueList;