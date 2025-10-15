import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import {
  createProject,
  deleteProject,
  getDepartmentProjects,
  projectLevelTeamAllocation,
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

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_PROJECTS_STATE: ProjectsData = {
  departmentId: "",
  projects: [],
  counts: { total: 0, planned: 0, active: 0, completed: 0 },
};

const ITEMS_PER_PAGE = 6;

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

  // Form reset ref
  const formRef = React.useRef<{ resetForm: () => void }>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    fetchProjectsAndEmployees();
  }, []);

  const fetchProjectsAndEmployees = async () => {
    setFetchLoading(true);
    try {
      const [projectsData, employeesData] = await Promise.allSettled([
        getDepartmentProjects(),
        projectLevelTeamAllocation(),
      ]);

      if (projectsData.status === "fulfilled" && projectsData.value) {
        setProjects(
          projectsData.value?.status === "error" || !projectsData.value
            ? INITIAL_PROJECTS_STATE
            : projectsData.value
        );
      } else {
        setProjects(INITIAL_PROJECTS_STATE);
        enqueueSnackbar("Failed to fetch projects.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }

      if (
        employeesData.status === "fulfilled" &&
        Array.isArray(employeesData.value) &&
        employeesData.value.length > 0
      ) {
        const departmentData: DepartmentEmployeeData[] = employeesData.value;
        setEmployees(departmentData[0]?.employee || []);
        setDepartmentId(departmentData[0]?.departmentId || "");
      } else {
        setEmployees([]);
        setDepartmentId("");
        enqueueSnackbar("No employees found for this department.", {
          variant: "warning",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setProjects(INITIAL_PROJECTS_STATE);
      setEmployees([]);
      setDepartmentId("");
      enqueueSnackbar("Failed to load projects and employees.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setFetchLoading(false);
    }
  };

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
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      await fetchProjectsAndEmployees();
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || "Failed to delete project.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsDeleting(false);
      handleCloseConfirm();
    }
  };

  // ============================================================================
  // FORM SUBMISSION HANDLER
  // ============================================================================

  const handleCreateProject = async (formValues: CreateProjectFormValues) => {
    const teamMemberIds = formValues.teamMemberIds || [];
    
    if (teamMemberIds.length === 0) {
      enqueueSnackbar("Please select at least one team member", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setSubmitLoading(true);
    try {
      // Validate dates
      const startDate = new Date(formValues.startDate);
      const endDate = new Date(formValues.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid start or end date.");
      }

      const payload: CreateProjectPayload = {
        name: formValues.name,
        key: formValues.key,
        description: formValues.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        departmentId: departmentId || projects.departmentId || "",
        status: formValues.status || "Planned",
        teamMemberIds: teamMemberIds,
      };

      console.log("PAYLOAD", payload);

      const data = await createProject(payload);

      enqueueSnackbar(data?.message || "Project created successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      await fetchProjectsAndEmployees();
      setIsProjectModalOpen(false);
      formRef.current?.resetForm();
    } catch (err: any) {
      enqueueSnackbar(err?.message || "Failed to create project.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
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
    const aValue = a[sortBy as keyof Project] || "";
    const bValue = b[sortBy as keyof Project] || "";

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
    setIsProjectModalOpen(true);
  };

  const closeModal = () => {
    setIsProjectModalOpen(false);
    formRef.current?.resetForm();
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
          disabled={submitLoading}
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
                onClick: (row) => alert(`Editing ${row.projectName}`),
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

      {/* Create Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={closeModal} title="Create Project">
        <div className="space-y-4">
          <div className="shadow-lg rounded-xl p-8 max-w-4xl mx-auto bg-gray-50">
            <AuthForm
              fields={createProjectFormFields}
              validationSchema={createProjectSchema}
              onSubmit={handleCreateProject}
              buttonText="Create Project"
              disabled={submitLoading}
              formRef={formRef}
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