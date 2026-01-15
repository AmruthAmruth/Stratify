import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import {
  createProject,
  deleteProject,
  updateProject
} from "@/services/projects";
import { useProjectContext } from "@/contexts/ProjectContext";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { createProjectFields } from "@/shared/components/Forms/formFields";
import { createProjectSchema } from "@/shared/utils/validations";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";


interface Employee {
  employeeId: string;
  name: string;
  position: string;
}

interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  status: string;
  projectLead?: string;
  departmentName?: string;
  remainingTimeInDays?: number;
  key: string;
  startDate: string;
  endDate: string;
  teamMemberIds: string[];
}

interface ProjectsData {
  departmentId?: string;
  projects: Project[];
  counts?: {
    total: number;
    planned: number;
    active: number;
    completed: number;
  };
}

interface CreateProjectFormValues {
  name: string;
  key: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "Planned" | "Active" | "Completed" | "Archived";
  teamMemberIds?: string[];
}

interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId: string;
  status: "Planned" | "Active" | "Completed" | "Archived";
  teamMemberIds: string[];
  [key: string]: unknown;
}

interface UpdateProjectPayload extends CreateProjectPayload {
  id: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_PROJECTS_STATE: ProjectsData = {
  departmentId: "",
  projects: [],
  counts: { total: 0, planned: 0, active: 0, completed: 0 },
};

const ITEMS_PER_PAGE = 6;

const SNACKBAR_OPTIONS = {
  anchorOrigin: { vertical: "top" as const, horizontal: "right" as const },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Projects: React.FC = () => {
  const navigate = useNavigate();

  // ============================================================================
  // CONTEXT
  // ============================================================================

  const {
    projects,
    employees,
    departmentId,
    loading,
    refreshProjects,
    optimisticCreateProject,
    optimisticUpdateProject,
    optimisticDeleteProject,
    rollback,
  } = useProjectContext();

  // ============================================================================
  // LOCAL STATE (UI only)
  // ============================================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form reset ref
  const formRef = React.useRef<{ resetForm: () => void }>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // ============================================================================
  // DELETE PROJECT HANDLERS
  // ============================================================================

  const handleOpenDeleteConfirm = (id: string) => {
    setSelectedProjectId(id);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedProjectId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProjectId) return;

    setIsDeleting(true);
    // Optimistic update
    optimisticDeleteProject(selectedProjectId);

    try {
      const data = await deleteProject(selectedProjectId);

      enqueueSnackbar(data?.message || "Project deleted successfully", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      // Refresh to get accurate data from server
      await refreshProjects();
    } catch (err: unknown) {
      // Rollback on error
      rollback();
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      enqueueSnackbar(error?.response?.data?.message || error?.message || "Failed to delete project.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
    } finally {
      setIsDeleting(false);
      handleCloseConfirm();
    }
  };

  // ============================================================================
  // FORM SUBMISSION HANDLERS
  // ============================================================================

  const handleUpdateProject = async (formValues: Record<string, unknown>) => {
    const values = formValues as unknown as CreateProjectFormValues;
    console.log("Form values", values);

    if (!editingProject || !departmentId) return;

    setSubmitLoading(true);

    // Optimistic update
    optimisticUpdateProject(editingProject.id, {
      name: values.name,
      key: values.key,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status || editingProject.status,
      teamMemberIds: values.teamMemberIds,
    });

    try {
      // Dates are sent as full ISO strings - backend should handle
      const payload: UpdateProjectPayload = {
        id: editingProject.id,
        name: values.name,
        key: values.key,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        departmentId: departmentId,
        status: values.status || editingProject.status as CreateProjectFormValues["status"],
        teamMemberIds: values.teamMemberIds || [],
      };

      console.log("UPDATE PAYLOAD", payload);

      const data = await updateProject(payload);

      enqueueSnackbar(data?.message || "Project updated successfully!", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      // Refresh to get accurate data from server
      await refreshProjects();
      closeModal();
    } catch (err: unknown) {
      // Rollback on error
      rollback();
      enqueueSnackbar((err as Error)?.message || "Failed to update project.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateProject = async (formValues: Record<string, unknown>) => {
    const values = formValues as unknown as CreateProjectFormValues;

    if (!departmentId) {
      enqueueSnackbar("Unable to create project: Department information is missing. Please contact your administrator.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
      console.error("❌ departmentId is missing when attempting to create project:", departmentId);
      return;
    }

    setSubmitLoading(true);

    // Optimistic update
    optimisticCreateProject({
      name: values.name,
      key: values.key,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status || "Planned",
      teamMemberIds: values.teamMemberIds,
    });

    try {
      const payload: CreateProjectPayload = {
        name: values.name,
        key: values.key,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        departmentId: departmentId,
        status: values.status || "Planned",
        teamMemberIds: values.teamMemberIds || [],
      };

      console.log("PAYLOAD", payload);

      const data = await createProject(payload);

      enqueueSnackbar(data?.message || "Project created successfully!", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      // Refresh to get accurate data from server
      await refreshProjects();
      closeModal();
    } catch (err: unknown) {
      // Rollback on error
      rollback();
      enqueueSnackbar((err as Error)?.message || "Failed to create project.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const handleViewProject = useCallback(
    (projectId: string) => navigate(`/project/${projectId}`),
    [navigate]
  );

  // ============================================================================
  // FILTERS, SORT, PAGINATION
  // ============================================================================

  const filteredProjects = projects.projects
    .filter((p) => p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => !filterStatus || p.status === filterStatus);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortBy) return 0;
    let aValue = a[sortBy as keyof Project] ?? "";
    let bValue = b[sortBy as keyof Project] ?? "";

    // Handle dates specifically
    if (sortBy === "startDate" || sortBy === "endDate") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const uniqueStatus = Array.from(new Set(projects.projects.map((p) => p.status)));

  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================

  const openModal = () => {
    console.log("=== openModal called ===");
    console.log("Current departmentId:", departmentId);
    console.log("Current isProjectModalOpen:", isProjectModalOpen);
    setEditingProject(null);
    setIsProjectModalOpen(true);
    console.log("Modal should now be open");
  };

  const openEditModal = (project: Project) => {
    // Ensure employees are loaded before opening edit modal
    if (employees.length === 0) {
      enqueueSnackbar("Loading employee data. Please try again shortly.", {
        variant: "warning",
        ...SNACKBAR_OPTIONS,
      });
      return;
    }
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const closeModal = () => {
    setIsProjectModalOpen(false);
    formRef.current?.resetForm();
    setTimeout(() => {
      setEditingProject(null);
    }, 300);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // ============================================================================
  // DYNAMIC FORM FIELDS WITH EMPLOYEE OPTIONS
  // ============================================================================

  const createProjectFormFields = [
    ...createProjectFields,
    {
      name: "teamMemberIds",
      label: "Add Team Members",
      type: "select",
      multiple: true,
      options: [
        { value: "", label: "Select team members..." },
        ...employees.map((emp) => ({
          value: emp.employeeId,
          label: `${emp.name} - ${emp.position}`,
        })),
      ],
    },
  ];

  // Helper to format date to full ISO for consistency
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  };

  console.log("Edit project ", editingProject);

  const initialFormValues = editingProject
    ? {
      name: editingProject.projectName,
      key: editingProject.key,
      description: editingProject.projectDescription,
      startDate: formatDateForInput(editingProject.startDate),
      endDate: formatDateForInput(editingProject.endDate),
      status: editingProject.status as "Planned" | "Active" | "Completed" | "Archived",
      teamMemberIds: editingProject.teamMemberIds || [],
    }
    : undefined;

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading.projects) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600">
        Loading projects...
      </div>
    );
  }

  console.log("=== RENDER DEBUG ===");
  console.log("departmentId:", departmentId);
  console.log("submitLoading:", submitLoading);
  console.log("Button disabled:", submitLoading || !departmentId);
  console.log("isProjectModalOpen:", isProjectModalOpen);

  return (
    <div className="text-text space-y-6">
      {/* Create Project Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            console.log("=== BUTTON CLICKED ===");
            console.log("departmentId at click:", departmentId);
            console.log("Button disabled:", submitLoading || !departmentId);
            if (departmentId) {
              openModal();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitLoading || !departmentId}
          title={!departmentId ? "Department information not available" : "Create a new project"}
        >
          + Create New Project
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Projects"
          value={projects.counts?.total ?? 0}
          subtitle="All department projects"
          trend={(projects.counts?.total ?? 0) > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Planned Projects"
          value={projects.counts?.planned ?? 0}
          subtitle="Not started yet"
          trend={(projects.counts?.planned ?? 0) > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Active Projects"
          value={projects.counts?.active ?? 0}
          subtitle="Currently running"
          trend={(projects.counts?.active ?? 0) > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Completed Projects"
          value={projects.counts?.completed ?? 0}
          subtitle="Finished successfully"
          trend={(projects.counts?.completed ?? 0) > 0 ? "up" : "down"}
        />
      </div>

      {/* Filter Bar */}
      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={uniqueStatus}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        sortOptions={[
          { key: "projectName", label: "Project Name" },
          { key: "projectLead", label: "Project Lead" },
          { key: "departmentName", label: "Department" },
          { key: "remainingTimeInDays", label: "Remaining Days" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
        ]}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Projects Table */}
      <Table
        columns={[
          { key: "projectName", label: "Project Name" },
          { key: "projectDescription", label: "Project Description" },
          { key: "status", label: "Status" },
          { key: "remainingTimeInDays", label: "Remaining Days" },
        ]}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyStateMessage="No projects"
        actions={[
          {
            label: "View More",
            type: "custom",
            onClick: (row) => handleViewProject(row.id),
          },
          {
            label: "Edit",
            type: "edit",
            onClick: (row) => openEditModal(row),
          },
          {
            label: "Delete",
            type: "delete",
            onClick: (row) => handleOpenDeleteConfirm(row.id),
            disabled: isDeleting,
          },
        ]}
      />

      {/* Create/Edit Project Modal */}
      {isProjectModalOpen && (
        <Modal
          isOpen={isProjectModalOpen}
          onClose={closeModal}
          title={editingProject ? "Edit Project" : "Create Project"}
        >
          <div className="space-y-4">
            <div className="shadow-lg rounded-xl p-8 max-w-4xl mx-auto bg-surface">
              <AuthForm
                key={editingProject?.id || 'new'}
                fields={createProjectFormFields}
                validationSchema={createProjectSchema}
                onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                buttonText={editingProject ? "Update Project" : "Create Project"}
                disabled={submitLoading}
                initialValues={initialFormValues}
              />
            </div>

            {submitLoading && (
              <div className="flex justify-center mt-4">
                <div
                  className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#009063" }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonDisabled={isDeleting}
      />
    </div>
  );
};

export default Projects;