import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getEmployeeProjects } from "@/services/projects";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import Table from "@/shared/components/Table/Table";

interface Project {
    id: string;
    projectName: string;
    projectDescription: string;
    status: string;
    remainingTimeInDays: number;
}

interface ProjectsData {
    employeeId: string;
    projects: Project[];
    counts: {
        total: number;
        planned: number;
        active: number;
        completed: number;
        archived: number;
    };
}

const ITEMS_PER_PAGE = 6;

const EmployeeProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            console.log("Fetching employee projects...");
            const data = await getEmployeeProjects();
            console.log("Employee projects data received:", data);
            setProjectsData(data);
        } catch (err: any) {
            console.error("Error fetching employee projects:", err);
            enqueueSnackbar(err?.message || "Failed to load projects", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleViewProject = useCallback(
        (projectId: string) => navigate(`/project/${projectId}`),
        [navigate]
    );

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("");
        setSortBy("");
        setSortOrder("asc");
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-600">
                Loading projects...
            </div>
        );
    }

    if (!projectsData || projectsData.projects.length === 0) {
        return (
            <div className="text-black space-y-6">
                <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                    <p className="text-lg mb-4">You are not assigned to any projects yet.</p>
                    <p className="text-sm">Please contact your manager for project assignments.</p>
                </div>
            </div>
        );
    }

    // Filter and sort projects
    const filteredProjects = projectsData.projects
        .filter((p) => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((p) => !filterStatus || p.status === filterStatus);

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (!sortBy) return 0;
        let aValue = a[sortBy as keyof Project] ?? "";
        let bValue = b[sortBy as keyof Project] ?? "";

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

    const uniqueStatus = Array.from(new Set(projectsData.projects.map((p) => p.status)));

    return (
        <div className="text-black space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DashboardCard
                    title="Total Projects"
                    value={projectsData.counts.total}
                    subtitle="Assigned to you"
                    trend={projectsData.counts.total > 0 ? "up" : "down"}
                />
                <DashboardCard
                    title="Planned"
                    value={projectsData.counts.planned}
                    subtitle="Not started"
                    trend={projectsData.counts.planned > 0 ? "up" : "down"}
                />
                <DashboardCard
                    title="Active"
                    value={projectsData.counts.active}
                    subtitle="In progress"
                    trend={projectsData.counts.active > 0 ? "up" : "down"}
                />
                <DashboardCard
                    title="Completed"
                    value={projectsData.counts.completed}
                    subtitle="Finished"
                    trend={projectsData.counts.completed > 0 ? "up" : "down"}
                />
                <DashboardCard
                    title="Archived"
                    value={projectsData.counts.archived}
                    subtitle="Archived"
                    trend={projectsData.counts.archived > 0 ? "up" : "down"}
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
                    { key: "status", label: "Status" },
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
                    { key: "projectDescription", label: "Description" },
                    { key: "status", label: "Status" },
                    { key: "remainingTimeInDays", label: "Remaining Days" },
                ]}
                data={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                actions={[
                    {
                        label: "View Details",
                        type: "custom",
                        onClick: (row) => handleViewProject(row.id),
                    },
                ]}
            />
        </div>
    );
};

export default EmployeeProjects;
