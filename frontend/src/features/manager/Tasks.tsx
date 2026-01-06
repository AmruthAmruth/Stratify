import React, { useEffect, useState, useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { enqueueSnackbar } from "notistack";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
    createSubTask,
    getIssuesForManager,
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

// Register Chart.js components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import type { Issue, SubTask } from "@/types/types";

interface GroupedIssues {
    [projectName: string]: Issue[];
}

const Tasks = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<SubTask | null>(null);
    const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
    const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchIssues = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getIssuesForManager();
            console.log("Manager Issues data:", data);
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

    // Chart data calculations
    const statusCounts = {
        planned: issues.filter((i) => i.status === "Planned").length,
        inProgress: issues.filter((i) => i.status === "In Progress").length,
        done: issues.filter((i) => i.status === "Done").length,
        blocked: issues.filter((i) => i.status === "Blocked").length,
    };

    const priorityCounts = {
        high: issues.filter((i) => i.priority === "High").length,
        medium: issues.filter((i) => i.priority === "Medium").length,
        low: issues.filter((i) => i.priority === "Low").length,
    };

    // Sprint progress data (mock data for demonstration - can be enhanced with real sprint data)
    const sprintProgressData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Completed Tasks",
                data: [5, 12, 18, completedSubtasks],
                borderColor: "#009063",
                backgroundColor: "rgba(0, 144, 99, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Total Tasks",
                data: [20, 25, 30, totalSubtasks],
                borderColor: "#dfdcef",
                backgroundColor: "rgba(223, 220, 239, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

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
    interface SubTaskFormData {
        title: string;
        description: string;
        estimatedHours: number;
        assignedTo?: string;
        status: string;
        priority: string;
        [key: string]: unknown;
    }

    const handleCreateSubTask = async (formData: Record<string, unknown>) => {
        if (!selectedIssueId) return;
        setSubmitLoading(true);
        try {
            await createSubTask({
                ...(formData as unknown as SubTaskFormData),
                issueId: selectedIssueId,
            });
            enqueueSnackbar("Subtask created successfully!", { variant: "success" });
            setIsCreateSubtaskModalOpen(false);
            await fetchIssues();
        } catch (error: unknown) {
            console.error("Failed to create subtask:", error);
            enqueueSnackbar(
                (error as Error)?.message || "Failed to create subtask",
                { variant: "error" }
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle edit subtask
    const handleEditSubTask = async (formData: Record<string, unknown>) => {
        if (!selectedSubtask) return;
        setSubmitLoading(true);
        try {
            await updateSubTask({
                id: selectedSubtask.id,
                ...(formData as unknown as SubTaskFormData),
            });
            enqueueSnackbar("Subtask updated successfully!", { variant: "success" });
            setIsEditSubtaskModalOpen(false);
            setSelectedSubtask(null);
            await fetchIssues();
        } catch (error: unknown) {
            console.error("Failed to update subtask:", error);
            enqueueSnackbar(
                (error as Error)?.message || "Failed to update subtask",
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
                return "bg-green-100 text-primaryHover border-green-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Done":
                return "bg-primary/10 text-primary border-primary";
            case "In Progress":
                return "bg-orange-50 text-orange-500 border-orange-500";
            case "Planned":
                return "bg-accent text-text border-purple-400";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <LoadingSpinner variant="spinner" size="large" />
                    <p className="mt-4 text-lg text-text">Loading department tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 text-text">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-heading">Task Management</h1>
                    <p className="text-text/80 mt-1">
                        Manage all department issues and subtasks
                    </p>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="Total Issues"
                    value={totalIssues}
                    subtitle="Department issues"
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

            {/* Data Visualization Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Issues by Status - Pie Chart */}
                <div className="bg-surface border border-accent rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-heading mb-4">Issues by Status</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Pie
                            data={{
                                labels: ["Planned", "In Progress", "Done", "Blocked"],
                                datasets: [
                                    {
                                        data: [
                                            statusCounts.planned,
                                            statusCounts.inProgress,
                                            statusCounts.done,
                                            statusCounts.blocked,
                                        ],
                                        backgroundColor: [
                                            "#9b8dc9",
                                            "#ff9800",
                                            "#009063",
                                            "#ef4444",
                                        ],
                                        borderColor: ["#9b8dc9", "#ff9800", "#009063", "#ef4444"],
                                        borderWidth: 2,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Issues by Priority - Bar Chart */}
                <div className="bg-surface border border-accent rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-heading mb-4">Issues by Priority</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: ["High", "Medium", "Low"],
                                datasets: [
                                    {
                                        label: "Issues",
                                        data: [
                                            priorityCounts.high,
                                            priorityCounts.medium,
                                            priorityCounts.low,
                                        ],
                                        backgroundColor: ["#ef4444", "#ff9800", "#009063"],
                                        borderColor: ["#dc2626", "#f97316", "#007a52"],
                                        borderWidth: 2,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Sprint Progress - Line Chart */}
                <div className="bg-surface border border-accent rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-heading mb-4">Sprint Progress</h3>
                    <div className="h-64">
                        <Line
                            data={sprintProgressData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Issues grouped by project */}
            {issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                    <p className="text-lg mb-2">No issues found in department projects.</p>
                    <p className="text-sm">Create projects and assign issues to get started.</p>
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
                                        className="bg-surface border border-accent rounded-xl p-6 shadow-sm"
                                    >
                                        {/* Issue Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-heading mb-2">
                                                    {issue.heading}
                                                </h3>
                                                <div className="mb-3">
                                                    <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                                                        Description
                                                    </p>
                                                    <p className="text-sm text-text/80">
                                                        {issue.description}
                                                    </p>
                                                </div>
                                                {issue.acceptanceCriteria && (
                                                    <div className="mb-3">
                                                        <p className="text-xs font-semibold text-text/60 uppercase tracking-wide mb-1">
                                                            Acceptance Criteria
                                                        </p>
                                                        <p className="text-sm text-text/80">
                                                            {issue.acceptanceCriteria}
                                                        </p>
                                                    </div>
                                                )}
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
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface text-text border border-accent">
                                                        {issue.type}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface text-text border border-accent">
                                                        ⏱️ {issue.estimatedHours}h
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedIssueId(issue.id);
                                                    setIsCreateSubtaskModalOpen(true);
                                                }}
                                                className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors whitespace-nowrap"
                                            >
                                                + Create Subtask
                                            </button>
                                        </div>

                                        {/* Kanban Board for Subtasks */}
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">
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
                    initialValues={selectedSubtask as unknown as Record<string, unknown>}
                    onSubmit={handleEditSubTask}
                    buttonText={submitLoading ? "Updating..." : "Update Subtask"}
                    disabled={submitLoading}
                />
            </Modal>
        </div>
    );
};

export default Tasks;
