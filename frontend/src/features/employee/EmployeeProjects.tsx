import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getEmployeeProjects, getProjectDetails } from "@/services/projects";
import DashboardCard from "@/shared/components/DashboardCards/Cards";

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

const EmployeeProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch employee's projects
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                console.log("Fetching employee projects...");
                const data = await getEmployeeProjects();
                console.log("Employee projects data received:", data);
                console.log("Projects array:", data?.projects);
                console.log("Projects length:", data?.projects?.length);

                setProjectsData(data);

                // Auto-select first project if available
                if (data?.projects && data.projects.length > 0) {
                    setSelectedProjectId(data.projects[0].id);
                    console.log("Auto-selected project:", data.projects[0].id);
                }
                setError(null);
            } catch (err: any) {
                console.error("Error fetching employee projects:", err);
                console.error("Error details:", err?.response?.data);
                setError(err?.message || "Failed to load projects");
                enqueueSnackbar(err?.message || "Failed to load projects", {
                    variant: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);


    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProjectId(event.target.value);
    };

    const handleViewProjectDetails = () => {
        if (selectedProjectId) {
            navigate(`/project/${selectedProjectId}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#009063] mx-auto"></div>
                    <p className="mt-4 text-lg text-[#3b3b3b]">Loading your projects...</p>
                </div>
            </div>
        );
    }

    if (error || !projectsData) {
        return (
            <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg max-w-md">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">
                            {error || "Failed to load projects"}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (projectsData.projects.length === 0) {
        return (
            <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-blue-50 border border-blue-300 text-blue-700 px-6 py-4 rounded-lg max-w-md">
                        <p className="text-lg">You are not assigned to any projects yet.</p>
                        <p className="text-sm mt-2">Please contact your manager for project assignments.</p>
                    </div>
                </div>
            </div>
        );
    }

    const selectedProject = projectsData.projects.find(
        (p) => p.id === selectedProjectId
    );

    console.log("Rendering EmployeeProjects component");
    console.log("ProjectsData:", projectsData);
    console.log("Selected Project ID:", selectedProjectId);
    console.log("Selected Project:", selectedProject);
    console.log("Number of projects:", projectsData.projects.length);

    return (
        <div className="min-h-screen bg-[#fbfbfb] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e9e6f5] p-6">
                    <h1 className="text-3xl font-bold text-[#2f2f2f] mb-4">My Projects</h1>
                    <p className="text-[#3b3b3b]/90 mb-6">
                        View and manage your assigned projects
                    </p>

                    {/* Project Selector */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <label
                            htmlFor="project-select"
                            className="text-sm font-medium text-[#3b3b3b] whitespace-nowrap"
                        >
                            Select Project:
                        </label>
                        <div className="flex-1 flex gap-3">
                            <select
                                id="project-select"
                                value={selectedProjectId}
                                onChange={handleProjectChange}
                                className="flex-1 px-4 py-2 border border-[#dfdcef] rounded-lg bg-white text-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-[#009063] focus:border-transparent"
                            >
                                {projectsData.projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.projectName} ({project.status})
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleViewProjectDetails}
                                disabled={!selectedProjectId}
                                className="px-6 py-2 bg-[#009063] text-white rounded-lg hover:bg-[#007a52] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

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

                {/* Selected Project Preview */}
                {selectedProject && (
                    <div className="bg-white rounded-2xl shadow-sm border border-[#e9e6f5] p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#2f2f2f]">
                                    {selectedProject.projectName}
                                </h2>
                                <p className="text-[#3b3b3b]/90 mt-2">
                                    {selectedProject.projectDescription}
                                </p>
                            </div>
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedProject.status === "Active"
                                    ? "bg-[#e6f7f0] text-[#009063] border border-[#009063]"
                                    : selectedProject.status === "Completed"
                                        ? "bg-[#e6f7f0] text-[#009063] border border-[#009063]"
                                        : selectedProject.status === "Planned"
                                            ? "bg-[#dfdcef] text-[#3b3b3b] border border-[#9b8dc9]"
                                            : "bg-gray-100 text-gray-600 border border-gray-300"
                                    }`}
                            >
                                {selectedProject.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="bg-[#fbfbfb] rounded-lg p-4">
                                <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                                    Remaining Time
                                </p>
                                <p className="text-2xl font-semibold text-[#2f2f2f] mt-1">
                                    {selectedProject.remainingTimeInDays > 0
                                        ? `${selectedProject.remainingTimeInDays} days`
                                        : selectedProject.remainingTimeInDays === 0
                                            ? "Due today"
                                            : "Overdue"}
                                </p>
                            </div>
                            <div className="bg-[#fbfbfb] rounded-lg p-4">
                                <p className="text-xs font-medium text-[#3b3b3b] uppercase tracking-wider opacity-70">
                                    Quick Action
                                </p>
                                <button
                                    onClick={handleViewProjectDetails}
                                    className="mt-2 w-full px-4 py-2 bg-[#009063] text-white rounded-lg hover:bg-[#007a52] transition-colors"
                                >
                                    Open Project
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects List */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e9e6f5] p-6">
                    <h3 className="text-xl font-bold text-[#2f2f2f] mb-4">All My Projects</h3>
                    <div className="space-y-3">
                        {projectsData.projects.map((project) => (
                            <div
                                key={project.id}
                                className={`p-4 rounded-lg border transition-all cursor-pointer ${project.id === selectedProjectId
                                    ? "border-[#009063] bg-[#e6f7f0]"
                                    : "border-[#dfdcef] bg-[#fbfbfb] hover:border-[#9b8dc9]"
                                    }`}
                                onClick={() => setSelectedProjectId(project.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#2f2f2f]">
                                            {project.projectName}
                                        </h4>
                                        <p className="text-sm text-[#3b3b3b]/80 mt-1">
                                            {project.projectDescription}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === "Active"
                                                ? "bg-[#009063] text-white"
                                                : project.status === "Completed"
                                                    ? "bg-[#009063] text-white"
                                                    : project.status === "Planned"
                                                        ? "bg-[#9b8dc9] text-white"
                                                        : "bg-gray-400 text-white"
                                                }`}
                                        >
                                            {project.status}
                                        </span>
                                        <span className="text-xs text-[#3b3b3b]/70">
                                            {project.remainingTimeInDays > 0
                                                ? `${project.remainingTimeInDays} days left`
                                                : project.remainingTimeInDays === 0
                                                    ? "Due today"
                                                    : "Overdue"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProjects;
