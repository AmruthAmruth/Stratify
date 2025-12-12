import React, { useEffect, useState, useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { enqueueSnackbar } from "notistack";
import {
  createSubTask,
  getIssuesForEmployee,
  updateSubTask,
} from "@/services/projects";
import { createSubTaskFields } from "@/shared/components/Forms/formFields";
import { createSubTaskSchema } from "@/shared/utils/validations";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import KanbanBoard from "@/shared/components/KanbanBoard/KanbanBoard";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import SimpleCollapsible from "@/shared/components/SimpleCollapsible/SimpleCollapsible";
import { LoadingSpinner } from "@/shared/components/Loading";


interface Subtask {
  id: string;
  title: string;
  description?: string;
  estimatedHours?: number;
  status: string;
}

interface Issue {
  id: string;
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  estimatedHours: number;
  type: string;
  status: string;
  priority: string;
  projectId: string;
  projectName?: string;
  sprintId?: string | null;
  assignedTo: string;
  subTasks?: Subtask[];
  createdAt: string;
  updatedAt: string;
}

interface GroupedIssues {
  [projectName: string]: Issue[];
}

const Task = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIssuesForEmployee();
      console.log("Issues data:", data);
      if (Array.isArray(data)) {
        setIssues(data);
      } else {
        console.warn("Invalid issue data format", data);
        setIssues([]);
      }
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      enqueueSnackbar("Failed to load tasks", { variant: "error" });
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Group issues by project
  const groupedIssues: GroupedIssues = issues.reduce((acc, issue) => {
    const projectName = issue.projectName || "Unknown Project";
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(issue);
    return acc;
  }, {} as GroupedIssues);

  // Calculate statistics
  const totalIssues = issues.length;
  const totalSubtasks = issues.reduce(
    (sum, issue) => sum + (issue.subTasks?.length || 0),
    0
  );
  const completedSubtasks = issues.reduce(
    (sum, issue) =>
      sum + (issue.subTasks?.filter((st) => st.status === "Done").length || 0),
    0
  );
  const inProgressSubtasks = issues.reduce(
    (sum, issue) =>
      sum +
      (issue.subTasks?.filter((st) => st.status === "In Progress").length || 0),
    0
  );

  // Handle drag end for subtasks
  const handleDragEnd = async (issueId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const subtaskId = active.id as string;
    const newStatus = over.id as string;

    // Optimistic update
    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            subTasks: issue.subTasks?.map((st) =>
              st.id === subtaskId ? { ...st, status: newStatus } : st
            ),
          };
        }
        return issue;
      })
    );

    try {
      await updateSubTask({ id: subtaskId, status: newStatus });
      enqueueSnackbar("Subtask status updated!", { variant: "success" });
    } catch (error) {
      console.error("Failed to update subtask:", error);
      enqueueSnackbar("Failed to update subtask status", { variant: "error" });
      // Revert on error
      await fetchIssues();
    }
  };

  // Handle create subtask
  const handleCreateSubTask = async (formData: any) => {
    if (!selectedIssueId) return;
    setSubmitLoading(true);
    try {
      await createSubTask({
        ...formData,
        issueId: selectedIssueId,
      });
      enqueueSnackbar("Subtask created successfully!", { variant: "success" });
      setIsCreateSubtaskModalOpen(false);
      await fetchIssues();
    } catch (error: any) {
      console.error("Failed to create subtask:", error);
      enqueueSnackbar(
        error?.message || "Failed to create subtask",
        { variant: "error" }
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle edit subtask
  const handleEditSubTask = async (formData: any) => {
    if (!selectedSubtask) return;
    setSubmitLoading(true);
    try {
      await updateSubTask({
        id: selectedSubtask.id,
        ...formData,
      });
      enqueueSnackbar("Subtask updated successfully!", { variant: "success" });
      setIsEditSubtaskModalOpen(false);
      setSelectedSubtask(null);
      await fetchIssues();
    } catch (error: any) {
      console.error("Failed to update subtask:", error);
      enqueueSnackbar(
        error?.message || "Failed to update subtask",
        { variant: "error" }
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-[#e6f7f0] text-[#009063] border-[#009063]";
      case "In Progress":
        return "bg-[#fff4e6] text-[#ff9800] border-[#ff9800]";
      case "Planned":
        return "bg-[#dfdcef] text-[#3b3b3b] border-[#9b8dc9]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner variant="spinner" size="large" />
          <p className="mt-4 text-lg text-[#3b3b3b]">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2f2f2f]">My Tasks</h1>
          <p className="text-[#3b3b3b]/80 mt-1">
            Manage your assigned issues and subtasks
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Issues"
          value={totalIssues}
          subtitle="Assigned to you"
          trend={totalIssues > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Total Subtasks"
          value={totalSubtasks}
          subtitle="All subtasks"
          trend={totalSubtasks > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="In Progress"
          value={inProgressSubtasks}
          subtitle="Being worked on"
          trend={inProgressSubtasks > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Completed"
          value={completedSubtasks}
          subtitle="Done subtasks"
          trend={completedSubtasks > 0 ? "up" : "down"}
        />
      </div>

      {/* Issues grouped by project */}
      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <p className="text-lg mb-2">No issues assigned yet.</p>
          <p className="text-sm">Contact your manager for task assignments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedIssues).map(([projectName, projectIssues]) => (
            <SimpleCollapsible
              key={projectName}
              title={`${projectName} (${projectIssues.length} ${projectIssues.length === 1 ? "issue" : "issues"
                })`}
              defaultOpen={true}
            >
              <div className="space-y-6">
                {projectIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white border border-[#dfdcef] rounded-xl p-6 shadow-sm"
                  >
                    {/* Issue Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#2f2f2f] mb-2">
                          {issue.heading}
                        </h3>
                        <p className="text-sm text-[#3b3b3b]/80 mb-3">
                          {issue.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              issue.priority
                            )}`}
                          >
                            {issue.priority} Priority
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              issue.status
                            )}`}
                          >
                            {issue.status}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fbfbfb] text-[#3b3b3b] border border-[#dfdcef]">
                            {issue.type}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fbfbfb] text-[#3b3b3b] border border-[#dfdcef]">
                            ⏱️ {issue.estimatedHours}h
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedIssueId(issue.id);
                          setIsCreateSubtaskModalOpen(true);
                        }}
                        className="ml-4 px-4 py-2 bg-[#009063] text-white rounded-lg hover:bg-[#007a52] transition-colors whitespace-nowrap"
                      >
                        + Create Subtask
                      </button>
                    </div>

                    {/* Kanban Board for Subtasks */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-[#2f2f2f] mb-3 uppercase tracking-wide">
                        Subtasks ({issue.subTasks?.length || 0})
                      </h4>
                      <KanbanBoard
                        subtasks={issue.subTasks || []}
                        onDragEnd={(event) => handleDragEnd(issue.id, event)}
                        onSubtaskClick={(subtask) => {
                          setSelectedSubtask(subtask);
                          setIsEditSubtaskModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SimpleCollapsible>
          ))}
        </div>

      )}

      {/* Create Subtask Modal */}
      <Modal
        isOpen={isCreateSubtaskModalOpen}
        onClose={() => setIsCreateSubtaskModalOpen(false)}
        title="Create Subtask"
      >
        <AuthForm
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          onSubmit={handleCreateSubTask}
          buttonText={submitLoading ? "Creating..." : "Create Subtask"}
          disabled={submitLoading}
        />
      </Modal>

      {/* Edit Subtask Modal */}
      <Modal
        isOpen={isEditSubtaskModalOpen}
        onClose={() => {
          setIsEditSubtaskModalOpen(false);
          setSelectedSubtask(null);
        }}
        title="Edit Subtask"
      >
        <AuthForm
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          initialValues={selectedSubtask as any}
          onSubmit={handleEditSubTask}
          buttonText={submitLoading ? "Updating..." : "Update Subtask"}
          disabled={submitLoading}
        />

      </Modal>
    </div>
  );
};

export default Task;
