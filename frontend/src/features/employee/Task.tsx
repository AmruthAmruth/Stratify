import React, { useEffect, useState } from "react";
import { createSubTask, getIssuesForEmployee } from "@/services/projects";
import { createSubTaskFields } from "@/shared/components/Forms/formFields";
import { createSubTaskSchema } from "@/shared/utils/validations";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";

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
  sprintId?: string | null;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

const Task = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch all issues assigned to the employee
  useEffect(() => {
    getIssuesForEmployee()
      .then((data) => {
        if (Array.isArray(data)) {
          setIssues(data);
        } else {
          console.warn("Invalid issue data format", data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch issues:", err);
      });
  }, []);

  // Handle Create Subtask
  const handleCreateSubTask = async (formData: any) => {
    if (!selectedIssueId) return;
    setSubmitLoading(true);
    try {
      await createSubTask({
        ...formData,
        issueId: selectedIssueId,
      });
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create subtask:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">My Issues</h2>

      {issues.length === 0 ? (
        <p className="text-gray-500">No issues assigned yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {issue.heading}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{issue.description}</p>

              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Acceptance Criteria:</strong>{" "}
                  {issue.acceptanceCriteria}
                </p>
                <p>
                  <strong>Type:</strong> {issue.type}
                </p>
                <p>
                  <strong>Status:</strong> {issue.status}
                </p>
                <p>
                  <strong>Priority:</strong> {issue.priority}
                </p>
                <p>
                  <strong>Size:</strong> {issue.size}
                </p>
                <p>
                  <strong>Est. Hours:</strong> {issue.estimatedHours}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedIssueId(issue.id);
                  setIsTaskModalOpen(true);
                }}
                className="mt-5 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Create Task
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Modal for Task Creation */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create Task"
      >
        <AuthForm
          fields={createSubTaskFields}
          validationSchema={createSubTaskSchema}
          onSubmit={handleCreateSubTask}
          buttonText={submitLoading ? "Creating..." : "Create Task"}
          disabled={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default Task;
