// components/project/IssueList.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { IssueDTO, UserRole, EmployeeDTO } from "./types";
import { createSubTask, deleteIssue, updateIssue, updateTask, deleteSubTask } from "@/services/projects";
import { useProjectContext } from "@/contexts/ProjectContext";
import { createSubTaskFields, updateIssueFields, updateSubTaskFields } from "../Forms/formFields";
import { createSubTaskSchema, updateIssueSchema, updateSubTaskSchema } from "@/shared/utils/validations";
import Modal from "../ModalFrom/ModalForm";
import AuthForm from "../Forms/DynamicForm";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { enqueueSnackbar } from "notistack";
import DraggableIssueCard from "./DraggableIssueCard";

interface Props {
  issues: IssueDTO[];
  role: UserRole;
  onRefresh?: () => Promise<void>;
  employees?: EmployeeDTO[];
}

const IssueList: React.FC<Props> = ({ issues: propIssues, role, onRefresh, employees }) => {
  const canEdit = role === "company" || role === "manager";

  // Get context methods for optimistic updates
  const { optimisticDeleteIssue, optimisticDeleteSubTask, rollback } = useProjectContext();

  // Local state for issues - this allows instant updates
  const [localIssues, setLocalIssues] = useState<IssueDTO[]>(propIssues);

  // Sync local state when prop changes (from parent refresh)
  useEffect(() => {
    setLocalIssues(propIssues);
  }, [propIssues]);

  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [updateIssueModalOpen, setUpdateIssueModalOpen] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);
  const [currentIssue, setCurrentIssue] = useState<IssueDTO | null>(null);

  const [updateSubTaskModalOpen, setUpdateSubTaskModalOpen] = useState(false);
  const [currentSubTask, setCurrentSubTask] = useState<{ id?: string; _id?: string; heading: string; description?: string; status: string; hours?: number; assignedToId?: string } | null>(null);

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
      if (newSet.has(issueId)) newSet.delete(issueId);
      else newSet.add(issueId);
      return newSet;
    });
  };

  const hasSubtasks = (issue: IssueDTO) => issue.subTasks?.length > 0;

  // Open subtask modal
  const openSubtaskModal = useCallback((issueId: string) => {
    setCurrentIssueId(issueId);
    setIsSubtaskModalOpen(true);
  }, []);

  const openUpdateIssueModal = useCallback((issue: IssueDTO) => {
    setCurrentIssue(issue);
    setUpdateIssueModalOpen(true);
  }, []);

  // Get dynamic update issue fields with employee options
  const getDynamicUpdateIssueFields = useCallback(() => {
    return updateIssueFields.map((field) => {
      if (field.name === "assignedTo" && employees) {
        return {
          ...field,
          options: [
            { label: "Unassigned", value: "" },
            ...employees.map((emp) => ({
              label: `${emp.name} — ${emp.position}`,
              value: emp.id,
            })),
          ],
        };
      }
      return field;
    });
  }, [employees]);

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

  const openUpdateSubTaskModal = useCallback((subTask: { id?: string; _id?: string; heading: string; description?: string; status: string; hours?: number; assignedToId?: string }) => {
    setCurrentSubTask(subTask);
    setUpdateSubTaskModalOpen(true);
  }, []);

  const closeUpdateSubTaskModal = useCallback(() => {
    updateSubTaskFormRef.current?.resetForm?.();
    setUpdateSubTaskModalOpen(false);
    setCurrentSubTask(null);
  }, []);

  const handleCreateSubtask = useCallback(
    async (values: Record<string, unknown>) => {
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
      } catch (err: unknown) {
        const error = err as { message?: string };
        enqueueSnackbar(error?.message || "Failed to create subtask", { variant: "error" });
      }
    },
    [currentIssueId, closeSubtaskModal, onRefresh]
  );

  const handleUpdateIssue = useCallback(
    async (values: Record<string, unknown>) => {
      if (!currentIssue) {
        enqueueSnackbar("No issue selected", { variant: "error" });
        return;
      }

      try {
        const payload = { ...values, id: currentIssue.id };
        await updateIssue(payload);

        // Wait for refresh to complete before closing modal
        // This ensures the UI updates with the new employee assignment
        if (onRefresh) {
          await onRefresh();
        }

        enqueueSnackbar("Issue updated successfully!", { variant: "success" });
        closeUpdateIssueModal();
      } catch (err: unknown) {
        const error = err as { message?: string };
        enqueueSnackbar(error?.message || "Failed to create issue", { variant: "error" });
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

        // Immediately remove from local state for instant UI update
        setLocalIssues((prev) => prev.filter((issue) => issue.id !== issueId));

        // Also update context for other components
        optimisticDeleteIssue(issueId);

        try {
          await deleteIssue(issueId);
          enqueueSnackbar("Issue deleted successfully!", { variant: "success" });
          // Refresh to ensure data consistency
          if (onRefresh) await onRefresh();
        } catch (err: unknown) {
          // Rollback both local and context state on error
          setLocalIssues(propIssues); // Restore from props
          rollback();
          const error = err as { message?: string };
          enqueueSnackbar(error?.message || "Failed to delete issue", { variant: "error" });
        }
      },
    });
  };

  // Update Subtask
  const handleUpdateSubTask = useCallback(
    async (values: Record<string, unknown>) => {
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
      } catch (err: unknown) {
        const error = err as { message?: string };
        enqueueSnackbar(error?.message || "Failed to update subtask", { variant: "error" });
      }
    },
    [currentSubTask, closeUpdateSubTaskModal, onRefresh]
  );

  // Delete Subtask
  const handleDeleteSubTask = (issueId: string, subTaskId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Subtask",
      message: "Are you sure you want to delete this subtask? This action cannot be undone.",
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });

        // Immediately remove from local state for instant UI update
        setLocalIssues((prev) =>
          prev.map((issue) =>
            issue.id === issueId
              ? { ...issue, subTasks: issue.subTasks?.filter((st) => st.id !== subTaskId) }
              : issue
          )
        );

        // Also update context for other components
        optimisticDeleteSubTask(issueId, subTaskId);

        try {
          await deleteSubTask(subTaskId);
          enqueueSnackbar("Subtask deleted successfully!", { variant: "success" });
          // Refresh to ensure data consistency
          if (onRefresh) await onRefresh();
        } catch (err: unknown) {
          // Rollback both local and context state on error
          setLocalIssues(propIssues); // Restore from props
          rollback();
          const error = err as { message?: string };
          enqueueSnackbar(error?.message || "Failed to delete subtask", { variant: "error" });
        }
      },
    });
  };

  if (!localIssues.length) {
    return (
      <div className="text-center py-16 bg-bg rounded-2xl border border-accent shadow-sm">
        <p className="text-xl text-text/60 font-light">No issues found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
            fields={getDynamicUpdateIssueFields()}
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
      {localIssues.map((issue) => {
        const isExpanded = expandedIssues.has(issue.id);
        const showSubtasks = canEdit || hasSubtasks(issue);

        // For backlog items (no sprintId), show draggable cards if user can edit
        if (canEdit && !issue.sprintId) {
          return (
            <div key={issue.id} className="mb-4">
              <DraggableIssueCard
                issue={issue}
                employees={employees}
                onClick={() => toggleExpanded(issue.id)}
              />

              {/* Expanded view for editing */}
              {isExpanded && (
                <div className="mt-2 bg-surface rounded-xl border-2 border-primary/20 p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-base text-text/80">{issue.description}</p>
                  </div>

                  {issue.acceptanceCriteria && (
                    <div>
                      <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                        Acceptance Criteria
                      </p>
                      <p className="text-base text-text/80">{issue.acceptanceCriteria}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2 border-t">
                    <button
                      className="flex-1 text-sm border rounded-lg px-4 py-2.5 hover:bg-accent"
                      onClick={() => openUpdateIssueModal(issue)}
                    >
                      Edit Issue
                    </button>

                    <button
                      className="flex-1 text-sm bg-red-500 text-white rounded-lg px-4 py-2.5 hover:bg-red-600"
                      onClick={() => handleDeleteIssue(issue.id)}
                    >
                      Delete Issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // For sprint issues or non-editable view, show traditional expandable cards
        return (
          <section
            key={issue.id}
            className="bg-bg rounded-2xl border border-accent shadow-sm overflow-hidden"
          >
            {/* Compact header (clickable) */}
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleExpanded(issue.id);
                }
              }}
              onClick={() => toggleExpanded(issue.id)}
              className="p-6 flex items-center justify-between gap-4 cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-semibold">{issue.heading}</h3>
                <p className="text-xs text-text/60 mt-1">
                  {issue.type} • {issue.size} • Est. {issue.estimatedHours}h • Assigned: {employees?.find((e) => e.id === issue.assignedTo)?.name || "Unassigned"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full capitalize">
                  {issue.priority}
                </span>

                {/* Chevron */}
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="p-8 space-y-6 border-t">
                <div>
                  <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                    Description
                  </p>
                  <p className="text-base text-text/80">{issue.description}</p>
                </div>

                {issue.acceptanceCriteria && (
                  <div>
                    <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                      Acceptance Criteria
                    </p>
                    <p className="text-base text-text/80">{issue.acceptanceCriteria}</p>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface border rounded-lg p-3">
                    <span className="text-xs text-text/60">Type</span>
                    <span className="block text-sm font-medium capitalize">{issue.type}</span>
                  </div>
                  <div className="bg-surface border rounded-lg p-3">
                    <span className="text-xs text-text/60">Status</span>
                    <span className="block text-sm font-semibold text-primary capitalize">
                      {issue.status}
                    </span>
                  </div>
                  <div className="bg-surface border rounded-lg p-3">
                    <span className="text-xs text-text/60">Size</span>
                    <span className="block text-sm font-medium">{issue.size}</span>
                  </div>

                  <div className="bg-surface border rounded-lg p-3">
                    <span className="text-xs text-text/60">Assigned To</span>
                    <span className="block text-sm font-medium">
                      {employees?.find((e) => e.id === issue.assignedTo)?.name || "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {canEdit && (
                  <div className="flex gap-3 pt-2 border-t">
                    <button
                      className="flex-1 text-sm border rounded-lg px-4 py-2.5 hover:bg-accent"
                      onClick={() => openUpdateIssueModal(issue)}
                    >
                      Edit Issue
                    </button>

                    <button
                      className="flex-1 text-sm bg-red-500 text-white rounded-lg px-4 py-2.5 hover:bg-red-600"
                      onClick={() => handleDeleteIssue(issue.id)}
                    >
                      Delete Issue
                    </button>
                  </div>
                )}

                {/* Subtasks */}
                {showSubtasks && (
                  <div className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-semibold">Subtasks</h4>

                      <div className="flex gap-3">
                        {canEdit && (
                          <button
                            className="text-sm bg-primary text-white rounded-lg px-6 py-2.5 hover:bg-primaryHover"
                            onClick={() => openSubtaskModal(issue.id)}
                          >
                            + Create Subtask
                          </button>
                        )}

                        {hasSubtasks(issue) && (
                          <button
                            className="text-sm border rounded-lg px-6 py-2.5 hover:bg-accent"
                            onClick={() => toggleExpanded(issue.id)}
                          >
                            {isExpanded ? "− Hide" : "+ Show"} Subtasks
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subtask List */}
                    {hasSubtasks(issue) ? (
                      <div className="space-y-4 pt-4 border-t">
                        {issue.subTasks!.map((sub) => (
                          <div key={sub.id} className="bg-surface border rounded-lg p-6 space-y-3">
                            <div className="flex justify-between items-start">
                              <p className="text-lg font-medium">{sub.heading}</p>
                              <span className="text-xs font-semibold bg-primary/80 text-white px-3 py-1 rounded-full">
                                {sub.status}
                              </span>
                            </div>

                            <p className="text-sm text-text/80">{sub.description}</p>

                            <div className="flex justify-between items-center border-t pt-2">
                              <span className="text-sm text-text/70">
                                Hours: <span className="font-semibold">{sub.hours}</span>
                              </span>

                              {canEdit && (
                                <div className="flex gap-2">
                                  <button
                                    className="text-xs border rounded px-3 py-1.5 hover:bg-accent"
                                    onClick={() => openUpdateSubTaskModal(sub)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="text-xs bg-red-500 text-white rounded px-3 py-1.5 hover:bg-red-600"
                                    onClick={() => handleDeleteSubTask(issue.id, sub.id)}
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
                      canEdit && <p className="text-sm text-text/60 pt-2">No subtasks yet.</p>
                    )}
                  </div>
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
