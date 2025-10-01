import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import { createProject, getDepartmentProjects } from "@/services/projects";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { createProjectFields } from "@/shared/components/Forms/formFields";
import { createProjectSchema } from "@/shared/utils/validations";

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

const ManagerProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const itemsPerPage = 6;
  const navigate = useNavigate();

  // ---------------- Fetch projects ----------------
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getDepartmentProjects();

        if (data?.status === "error") {
          setProjects({
            departmentId: "",
            projects: [],
            counts: { total: 0, planned: 0, active: 0, completed: 0 },
          });
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);

        // fallback
        setProjects({
          departmentId: "",
          projects: [],
          counts: { total: 0, planned: 0, active: 0, completed: 0 },
        });
      }
    };

    fetchProjects();
  }, []);

  // ---------------- Create Project Handler ----------------
  const handleCreateProject = async (values: any) => {
    setSubmitLoading(true);
    try {
      const payload = { ...values, departmentId: projects?.departmentId || "" };
      await createProject(payload);

      enqueueSnackbar("Project Created Successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      const updatedProjects = await getDepartmentProjects();
      setProjects(updatedProjects);

      setIsProjectModalOpen(false);
    } catch (err: unknown) {
      console.error("Error creating project:", err);
      const errorMessage =
        (err as any)?.message || "Failed to create project. Try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ---------------- Filtering ----------------
  const filteredProjects =
    projects?.projects
      ?.filter((p) =>
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      ?.filter((p) => (filterStatus ? p.status === filterStatus : true)) || [];

  // ---------------- Sorting ----------------
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

  // ---------------- Pagination ----------------
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ---------------- Unique status options ----------------
  const uniqueStatus = projects?.projects
    ? Array.from(new Set(projects.projects.map((p) => p.status)))
    : [];

  // ---------------- Clear filters ----------------
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setSortBy("");
    setSortOrder("asc");
  };

  // ---------------- Navigate to project details ----------------
  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // ---------------- Loading ----------------
  if (!projects) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="text-black space-y-6">
      {/* ---------------- Create Project Button (always visible) ---------------- */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Create Project
        </button>
      </div>

      {/* ---------------- Empty State ---------------- */}
      {projects.projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <p className="text-lg mb-4">No projects found in this department.</p>
        </div>
      ) : (
        <>
          {/* ---------------- Dashboard cards ---------------- */}
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

          {/* ---------------- Filter bar ---------------- */}
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

          {/* ---------------- Projects table ---------------- */}
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
            onPageChange={(page) => setCurrentPage(page)}
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

      {/* ---------------- Create Project Modal ---------------- */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create Project"
      >
        <AuthForm
          fields={createProjectFields}
          validationSchema={createProjectSchema}
          onSubmit={handleCreateProject}
          buttonText={submitLoading ? "Creating..." : "Create Project"}
          disabled={submitLoading}
        />

        {submitLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerProjects;
