import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import {
  createProject,
  deleteProject,
  getDepartmentProjects,
  projectLevelTeamAllocation,
  updateProject
} from "@/services/projects";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { createProjectFields } from "@/shared/components/Forms/formFields";
import { createProjectSchema } from "@/shared/utils/validations";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Employee {
  employeeId: string;
  name: string;
  position: string;
}

interface DepartmentEmployeeData {
  departmentId: string;
  employee: Employee[];
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
  departmentId: string;
  projects: Project[];
  counts: {
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

const ManagerProjects: React.FC = () => {
  const navigate = useNavigate();

  // ============================================================================
  // STATE
  // ============================================================================

  const [projects, setProjects] = useState<ProjectsData>(INITIAL_PROJECTS_STATE);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form reset ref
  const formRef = React.useRef<{ resetForm: () => void }>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchProjectsAndEmployees = useCallback(async () => {
    setFetchLoading(true);
    try {
      const [projectsResponse, employeesResponse] = await Promise.all([
        getDepartmentProjects(),
        projectLevelTeamAllocation(),
      ]);

      // Handle projects
      if (projectsResponse && !projectsResponse.status?.includes("error")) {
        setProjects(projectsResponse);
      } else {
        setProjects(INITIAL_PROJECTS_STATE);
        enqueueSnackbar("Failed to fetch projects.", {
          variant: "error",
          ...SNACKBAR_OPTIONS,
        });
      }

      // Handle employees - assume first department or enhance with auth context
      if (Array.isArray(employeesResponse) && employeesResponse.length > 0) {
        const departmentData: DepartmentEmployeeData[] = employeesResponse;
        setEmployees(departmentData[0]?.employee || []);
        setDepartmentId(departmentData[0]?.departmentId || "");
      } else {
        setEmployees([]);
        setDepartmentId("");
        enqueueSnackbar("No employees found for this department.", {
          variant: "warning",
          ...SNACKBAR_OPTIONS,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setProjects(INITIAL_PROJECTS_STATE);
      setEmployees([]);
      setDepartmentId("");
      enqueueSnackbar("Failed to load projects and employees.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsAndEmployees();
  }, [fetchProjectsAndEmployees]);

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
    try {
      const data = await deleteProject(selectedProjectId);

      enqueueSnackbar(data?.message || "Project deleted successfully", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      await fetchProjectsAndEmployees();
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || "Failed to delete project.", {
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

  const handleUpdateProject = async (formValues: CreateProjectFormValues) => {
    console.log("Form values",formValues);
    
    if (!editingProject || !departmentId) return;

    setSubmitLoading(true);
    try {
      // Dates are sent as full ISO strings - backend should handle
      const payload: UpdateProjectPayload = {
        id: editingProject.id,
        name: formValues.name,
        key: formValues.key,
        description: formValues.description,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        departmentId: departmentId,
        status: formValues.status || editingProject.status as CreateProjectFormValues["status"],
        teamMemberIds: formValues.teamMemberIds || [],
      };

      console.log("UPDATE PAYLOAD", payload);

      const data = await updateProject(payload);

      enqueueSnackbar(data?.message || "Project updated successfully!", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      await fetchProjectsAndEmployees();
      closeModal();
    } catch (err: any) {
      enqueueSnackbar(err?.message || "Failed to update project.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateProject = async (formValues: CreateProjectFormValues) => {
    if (!departmentId) {
      enqueueSnackbar("Department not available. Cannot create project.", {
        variant: "error",
        ...SNACKBAR_OPTIONS,
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const payload: CreateProjectPayload = {
        name: formValues.name,
        key: formValues.key,
        description: formValues.description,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        departmentId: departmentId,
        status: formValues.status || "Planned",
        teamMemberIds: formValues.teamMemberIds || [],
      };

      console.log("PAYLOAD", payload);

      const data = await createProject(payload);

      enqueueSnackbar(data?.message || "Project created successfully!", {
        variant: "success",
        ...SNACKBAR_OPTIONS,
      });

      await fetchProjectsAndEmployees();
      closeModal();
    } catch (err: any) {
      enqueueSnackbar(err?.message || "Failed to create project.", {
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
    .filter((p) => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
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
    setEditingProject(null);
    setIsProjectModalOpen(true);
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="text-black space-y-6">
      {/* Create Project Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          disabled={submitLoading || !departmentId}
        >
          + Create Project
        </button>
      </div>

      {/* Empty State */}
      {projects.projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <p className="text-lg mb-4">No projects found in this department.</p>
        </div>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Projects"
              value={projects.counts.total}
              subtitle="All department projects"
              trend={projects.counts.total > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Planned Projects"
              value={projects.counts.planned}
              subtitle="Not started yet"
              trend={projects.counts.planned > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Active Projects"
              value={projects.counts.active}
              subtitle="Currently running"
              trend={projects.counts.active > 0 ? "up" : "down"}
            />
            <DashboardCard
              title="Completed Projects"
              value={projects.counts.completed}
              subtitle="Finished successfully"
              trend={projects.counts.completed > 0 ? "up" : "down"}
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
        </>
      )}

      {/* Create/Edit Project Modal */}
      {isProjectModalOpen && (
        <Modal 
          isOpen={isProjectModalOpen} 
          onClose={closeModal} 
          title={editingProject ? "Edit Project" : "Create Project"}
        >
          <div className="space-y-4">
            <div className="shadow-lg rounded-xl p-8 max-w-4xl mx-auto bg-gray-50">
              <AuthForm
                key={editingProject?.id || 'new'}
                fields={createProjectFormFields}
                validationSchema={createProjectSchema}
                onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                buttonText={editingProject ? "Update Project" : "Create Project"}
                disabled={submitLoading}
                formRef={formRef} 
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

export default ManagerProjects;