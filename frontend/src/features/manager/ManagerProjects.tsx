import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import {
  createProject,
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

interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  startDate: string;
  endDate: string;
  departmentId: string;
  status?: "Planned" | "Active" | "Completed" | "Archived";
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

  // State
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [teamSelectionError, setTeamSelectionError] = useState("");

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    fetchProjectsAndEmployees();
  }, []);

  const fetchProjectsAndEmployees = async () => {
    try {
      const [projectsData, employeesData] = await Promise.allSettled([
        getDepartmentProjects(),
        projectLevelTeamAllocation(),
      ]);

      // Handle projects data
      if (projectsData.status === "fulfilled") {
        const data = projectsData.value;
        setProjects(data?.status === "error" ? INITIAL_PROJECTS_STATE : data);
      } else {
        setProjects(INITIAL_PROJECTS_STATE);
        console.error("Error fetching projects:", projectsData.reason);
      }

      // Handle employees & department data
      if (employeesData.status === "fulfilled" && Array.isArray(employeesData.value)) {
        const departmentData: DepartmentEmployeeData[] = employeesData.value;

        if (departmentData.length > 0) {
          setEmployees(departmentData[0].employee || []);
          setDepartmentId(departmentData[0].departmentId || "");
        } else {
          setEmployees([]);
          setDepartmentId("");
        }
      } else {
        console.error(
          "Error fetching employees:",
          employeesData.status === "rejected"
            ? employeesData.reason
            : "Invalid data format"
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setProjects(INITIAL_PROJECTS_STATE);
      setEmployees([]);
      setDepartmentId("");
    }
  };

  // ============================================================================
  // EMPLOYEE SELECTION HANDLERS
  // ============================================================================

  const handleEmployeeToggle = useCallback(
    (employeeId: string) => {
      setSelectedEmployeeIds((prev) =>
        prev.includes(employeeId)
          ? prev.filter((id) => id !== employeeId)
          : [...prev, employeeId]
      );

      if (teamSelectionError) setTeamSelectionError("");
    },
    [teamSelectionError]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedEmployeeIds((prev) =>
      prev.length === employees.length ? [] : employees.map((emp) => emp.employeeId)
    );

    if (teamSelectionError) setTeamSelectionError("");
  }, [employees, teamSelectionError]);

  // ============================================================================
  // FORM SUBMISSION HANDLER
  // ============================================================================

  const handleCreateProject = async (formValues: Record<string, any>) => {
    if (selectedEmployeeIds.length === 0) {
      setTeamSelectionError("Please select at least one team member");
      enqueueSnackbar("Please select at least one team member", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const payload: CreateProjectPayload = {
        name: formValues.projectName || formValues.name,
        key: formValues.projectKey || formValues.key,
        description: formValues.projectDescription || formValues.description,
        startDate: new Date(formValues.startDate).toISOString(),
        endDate: new Date(formValues.endDate).toISOString(),
        departmentId: departmentId || projects?.departmentId || "",
        status: formValues.status || "Planned",
        teamMemberIds: selectedEmployeeIds,
      };

      // Call createProject and get backend response
      const data = await createProject(payload);

      // Show success message
      enqueueSnackbar(data?.message || "Project created successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Refresh project list
      try {
        const updatedProjects = await getDepartmentProjects();
        setProjects(updatedProjects);
      } catch (refreshErr) {
        console.error("Failed to refresh projects:", refreshErr);
        enqueueSnackbar("Project created, but failed to refresh the project list. Please reload the page.", {
          variant: "warning",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }

      // Close modal after success
      setIsProjectModalOpen(false);
      setSelectedEmployeeIds([]);
      setTeamSelectionError("");
    } catch (err: any) {
      // Show backend error message or fallback
      enqueueSnackbar(err?.message || "Failed to create project. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================

  const openModal = () => setIsProjectModalOpen(true);

  const closeModal = useCallback(() => {
    setIsProjectModalOpen(false);
    setSelectedEmployeeIds([]);
    setTeamSelectionError("");
  }, []);

  // ============================================================================
  // DATA FILTERING, SORTING & PAGINATION
  // ============================================================================

  const filteredProjects =
    projects?.projects
      ?.filter((p) =>
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      ?.filter((p) => !filterStatus || p.status === filterStatus) || [];

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
  const paginatedData = sortedProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const uniqueStatus = projects?.projects
    ? Array.from(new Set(projects.projects.map((p) => p.status)))
    : [];

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterStatus("");
    setSortBy("");
    setSortOrder("asc");
  }, []);

  // ============================================================================
  // NAVIGATION HANDLER
  // ============================================================================

  const handleViewProject = useCallback(
    (projectId: string) => {
      navigate(`/project/${projectId}`);
    },
    [navigate]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!projects) {
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
                label: "Archive",
                type: "delete",
                onClick: (row) => alert(`Archiving ${row.projectName}`),
              },
            ]}
          />
        </>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateProject}
        employees={employees}
        selectedEmployeeIds={selectedEmployeeIds}
        onEmployeeToggle={handleEmployeeToggle}
        onSelectAll={handleSelectAll}
        submitLoading={submitLoading}
        teamSelectionError={teamSelectionError}
      />
    </div>
  );
};

// ============================================================================
// CREATE PROJECT MODAL COMPONENT
// ============================================================================

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => void;
  employees: Employee[];
  selectedEmployeeIds: string[];
  onEmployeeToggle: (id: string) => void;
  onSelectAll: () => void;
  submitLoading: boolean;
  teamSelectionError: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  selectedEmployeeIds,
  onEmployeeToggle,
  onSelectAll,
  submitLoading,
  teamSelectionError,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project">
      <div className="space-y-0">
        <ProjectFormWithTeamSelection
          onSubmit={onSubmit}
          employees={employees}
          selectedEmployeeIds={selectedEmployeeIds}
          onEmployeeToggle={onEmployeeToggle}
          onSelectAll={onSelectAll}
          submitLoading={submitLoading}
          teamSelectionError={teamSelectionError}
        />

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
  );
};

// ============================================================================
// PROJECT FORM WITH TEAM SELECTION COMPONENT
// ============================================================================

interface ProjectFormWithTeamSelectionProps {
  onSubmit: (values: Record<string, any>) => void;
  employees: Employee[];
  selectedEmployeeIds: string[];
  onEmployeeToggle: (id: string) => void;
  onSelectAll: () => void;
  submitLoading: boolean;
  teamSelectionError: string;
}

const ProjectFormWithTeamSelection: React.FC<ProjectFormWithTeamSelectionProps> =
  ({
    onSubmit,
    employees,
    selectedEmployeeIds,
    onEmployeeToggle,
    onSelectAll,
    submitLoading,
    teamSelectionError,
  }) => {
    return (
      <div className="relative">
        <div
          className="shadow-lg rounded-xl rounded-b-none p-8 max-w-4xl mx-auto"
          style={{ backgroundColor: "#fbfbfb" }}
        >
          <AuthForm
            fields={createProjectFields}
            validationSchema={createProjectSchema}
            onSubmit={onSubmit}
            buttonText="Create Project"
            disabled={submitLoading}
          />
        </div>

        <TeamMemberSelection
          employees={employees}
          selectedEmployeeIds={selectedEmployeeIds}
          onEmployeeToggle={onEmployeeToggle}
          onSelectAll={onSelectAll}
          teamSelectionError={teamSelectionError}
        />
      </div>
    );
  };

// ============================================================================
// TEAM MEMBER SELECTION COMPONENT
// ============================================================================

interface TeamMemberSelectionProps {
  employees: Employee[];
  selectedEmployeeIds: string[];
  onEmployeeToggle: (id: string) => void;
  onSelectAll: () => void;
  teamSelectionError: string;
}

const TeamMemberSelection: React.FC<TeamMemberSelectionProps> = ({
  employees,
  selectedEmployeeIds,
  onEmployeeToggle,
  onSelectAll,
  teamSelectionError,
}) => {
  const isAllSelected =
    selectedEmployeeIds.length === employees.length && employees.length > 0;

  return (
    <div
      className="shadow-lg rounded-b-xl p-8 pt-4 max-w-4xl mx-auto -mt-8"
      style={{ backgroundColor: "#fbfbfb" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "#3b3b3b" }}>
          Select Team Members ({selectedEmployeeIds.length} selected)
        </h3>
        {employees.length > 0 && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: "#009063" }}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-8" style={{ color: "#3b3b3b" }}>
          No employees available
        </div>
      ) : (
        <div
          className="max-h-64 overflow-y-auto rounded-lg"
          style={{ border: "1px solid #dfdcef" }}
        >
          {employees.map((employee, index) => (
            <EmployeeCheckboxItem
              key={employee.employeeId}
              employee={employee}
              isChecked={selectedEmployeeIds.includes(employee.employeeId)}
              onToggle={() => onEmployeeToggle(employee.employeeId)}
              showBorder={index < employees.length - 1}
            />
          ))}
        </div>
      )}

      {teamSelectionError && (
        <p className="text-xs mt-2" style={{ color: "#f87171" }}>
          {teamSelectionError}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// EMPLOYEE CHECKBOX ITEM COMPONENT
// ============================================================================

interface EmployeeCheckboxItemProps {
  employee: Employee;
  isChecked: boolean;
  onToggle: () => void;
  showBorder: boolean;
}

const EmployeeCheckboxItem: React.FC<EmployeeCheckboxItemProps> = ({
  employee,
  isChecked,
  onToggle,
  showBorder,
}) => {
  return (
    <label
      className="flex items-center p-4 cursor-pointer transition hover:bg-gray-50"
      style={{
        borderBottom: showBorder ? "1px solid #dfdcef" : "none",
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
        className="w-4 h-4 rounded focus:ring-2"
        style={{ accentColor: "#009063" }}
      />
      <div className="ml-3 flex-1">
        <div className="text-sm font-medium" style={{ color: "#3b3b3b" }}>
          {employee.name}
        </div>
        <div className="text-sm" style={{ color: "#6b7280" }}>
          {employee.position}
        </div>
      </div>
    </label>
  );
};

export default ManagerProjects;