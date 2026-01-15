import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
    getDepartmentProjects,
    getProjectDetails,
    getIssuesForManager,
    projectLevelTeamAllocation,
    employeeUnderTheProject,
    getEmployeesNotInProject,
} from '@/services/projects';
import type { Issue, Project, SubTask } from '@/types/types';
import type {
    Employee,
    DepartmentEmployeeData,
    ProjectsData,
    Sprint,
    ProjectDetails,
    ProjectContextValue,
} from './ProjectContext.types';

// ============================================================================
// CONTEXT
// ============================================================================

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ProjectProviderProps {
    children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    // State
    const [projects, setProjects] = useState<ProjectsData>({
        departmentId: '',
        projects: [],
        counts: { total: 0, planned: 0, active: 0, completed: 0 },
    });
    const [currentProject, setCurrentProject] = useState<ProjectDetails | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeesNotInProject, setEmployeesNotInProject] = useState<Employee[]>([]);
    const [departmentId, setDepartmentId] = useState<string>('');
    const [loading, setLoading] = useState({
        projects: false,
        projectDetails: false,
        issues: false,
        employees: false,
    });

    // Snapshot for rollback
    const [snapshot, setSnapshot] = useState<{
        projects?: ProjectsData;
        currentProject?: ProjectDetails | null;
        issues?: Issue[];
    }>({});

    // ============================================================================
    // REFRESH METHODS
    // ============================================================================

    const refreshProjects = useCallback(async () => {
        setLoading((prev) => ({ ...prev, projects: true }));
        try {
            const [projectsResponse, employeesResponse] = await Promise.all([
                getDepartmentProjects(),
                projectLevelTeamAllocation().catch(() => []),
            ]);

            if (projectsResponse && !projectsResponse.status?.includes('error')) {
                const projectData = projectsResponse as unknown as ProjectsData;
                setProjects(projectData);

                if (projectData.departmentId) {
                    setDepartmentId(projectData.departmentId);
                }
            }

            if (Array.isArray(employeesResponse) && employeesResponse.length > 0) {
                const departmentData: DepartmentEmployeeData[] = employeesResponse;
                setEmployees(departmentData[0]?.employee || []);
            }
        } catch (err) {
            console.error('Failed to refresh projects:', err);
            enqueueSnackbar('Failed to load projects', { variant: 'error' });
        } finally {
            setLoading((prev) => ({ ...prev, projects: false }));
        }
    }, []);

    const refreshProjectDetails = useCallback(async (projectId: string) => {
        setLoading((prev) => ({ ...prev, projectDetails: true }));
        try {
            const data = await getProjectDetails(projectId);
            setCurrentProject(data as unknown as ProjectDetails);
        } catch (err) {
            console.error('Failed to refresh project details:', err);
            enqueueSnackbar('Failed to load project details', { variant: 'error' });
        } finally {
            setLoading((prev) => ({ ...prev, projectDetails: false }));
        }
    }, []);

    const refreshIssues = useCallback(async () => {
        setLoading((prev) => ({ ...prev, issues: true }));
        try {
            const data = await getIssuesForManager();
            if (Array.isArray(data)) {
                setIssues(data);
            }
        } catch (err) {
            console.error('Failed to refresh issues:', err);
            enqueueSnackbar('Failed to load issues', { variant: 'error' });
        } finally {
            setLoading((prev) => ({ ...prev, issues: false }));
        }
    }, []);

    const refreshEmployees = useCallback(async () => {
        setLoading((prev) => ({ ...prev, employees: true }));
        try {
            const employeesResponse = await projectLevelTeamAllocation();
            if (Array.isArray(employeesResponse) && employeesResponse.length > 0) {
                const departmentData: DepartmentEmployeeData[] = employeesResponse;
                setEmployees(departmentData[0]?.employee || []);
            }
        } catch (err) {
            console.error('Failed to refresh employees:', err);
        } finally {
            setLoading((prev) => ({ ...prev, employees: false }));
        }
    }, []);

    const refreshProjectEmployees = useCallback(async (projectId: string) => {
        setLoading((prev) => ({ ...prev, employees: true }));
        try {
            const [employeeData, employeesNotInProjectData] = await Promise.all([
                employeeUnderTheProject(projectId),
                getEmployeesNotInProject(projectId),
            ]);

            if (employeeData && Array.isArray(employeeData)) {
                setEmployees(employeeData as unknown as Employee[]);
            }

            if (employeesNotInProjectData) {
                setEmployeesNotInProject(employeesNotInProjectData as unknown as Employee[]);
            }
        } catch (err) {
            console.error('Failed to refresh project employees:', err);
        } finally {
            setLoading((prev) => ({ ...prev, employees: false }));
        }
    }, []);

    // ============================================================================
    // OPTIMISTIC UPDATE METHODS
    // ============================================================================

    const createSnapshot = useCallback(() => {
        setSnapshot({
            projects: { ...projects },
            currentProject: currentProject ? { ...currentProject } : null,
            issues: [...issues],
        });
    }, [projects, currentProject, issues]);

    const optimisticCreateProject = useCallback((project: Partial<Project>) => {
        createSnapshot();
        setProjects((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                {
                    id: `temp-${Date.now()}`,
                    name: project.name || '',
                    key: project.key || '',
                    description: project.description || '',
                    status: project.status || 'Planned',
                    startDate: project.startDate || '',
                    endDate: project.endDate || '',
                    departmentId: prev.departmentId || '',
                    projectLeadId: '',
                    companyId: '',
                    projectName: project.name,
                    projectDescription: project.description,
                    ...project,
                } as Project,
            ],
            counts: prev.counts
                ? {
                    ...prev.counts,
                    total: prev.counts.total + 1,
                    planned: prev.counts.planned + (project.status === 'Planned' ? 1 : 0),
                    active: prev.counts.active + (project.status === 'Active' ? 1 : 0),
                    completed: prev.counts.completed + (project.status === 'Completed' ? 1 : 0),
                }
                : undefined,
        }));
    }, [createSnapshot]);

    const optimisticUpdateProject = useCallback((projectId: string, updates: Partial<Project>) => {
        createSnapshot();
        setProjects((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
                p.id === projectId ? { ...p, ...updates, projectName: updates.name, projectDescription: updates.description } : p
            ),
        }));

        if (currentProject && currentProject.id === projectId) {
            setCurrentProject((prev) => (prev ? { ...prev, ...updates } as ProjectDetails : null));
        }
    }, [createSnapshot, currentProject]);

    const optimisticDeleteProject = useCallback((projectId: string) => {
        createSnapshot();
        setProjects((prev) => {
            const deletedProject = prev.projects.find((p) => p.id === projectId);
            return {
                ...prev,
                projects: prev.projects.filter((p) => p.id !== projectId),
                counts: prev.counts && deletedProject
                    ? {
                        ...prev.counts,
                        total: prev.counts.total - 1,
                        planned: prev.counts.planned - (deletedProject.status === 'Planned' ? 1 : 0),
                        active: prev.counts.active - (deletedProject.status === 'Active' ? 1 : 0),
                        completed: prev.counts.completed - (deletedProject.status === 'Completed' ? 1 : 0),
                    }
                    : prev.counts,
            };
        });
    }, [createSnapshot]);

    const optimisticCreateSprint = useCallback((projectId: string, sprint: Partial<Sprint>) => {
        createSnapshot();
        if (currentProject && currentProject.id === projectId) {
            const newSprint: Sprint = {
                id: `temp-${Date.now()}`,
                name: sprint.name || '',
                status: sprint.status || 'Planned',
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                issues: [],
                ...sprint,
            };

            setCurrentProject((prev) => {
                if (!prev) return null;
                const targetArray = sprint.status === 'Active' ? 'activeSprints' : 'plannedSprints';
                return {
                    ...prev,
                    [targetArray]: [...(prev[targetArray] || []), newSprint],
                };
            });
        }
    }, [createSnapshot, currentProject]);

    const optimisticCreateIssue = useCallback((projectId: string, issue: Partial<Issue>) => {
        createSnapshot();
        if (currentProject && currentProject.id === projectId) {
            const newIssue: Issue = {
                id: `temp-${Date.now()}`,
                heading: issue.heading || '',
                description: issue.description || '',
                type: issue.type || 'Task',
                status: issue.status || 'Planned',
                priority: issue.priority || 'Medium',
                estimatedHours: issue.estimatedHours,
                acceptanceCriteria: issue.acceptanceCriteria,
                subTasks: [],
                ...issue,
            };

            setCurrentProject((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    backlog: [...(prev.backlog || []), newIssue],
                };
            });
        }
    }, [createSnapshot, currentProject]);

    const optimisticUpdateIssue = useCallback((issueId: string, updates: Partial<Issue>) => {
        createSnapshot();
        setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, ...updates } : issue)));

        if (currentProject) {
            setCurrentProject((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    backlog: prev.backlog?.map((issue) => (issue.id === issueId ? { ...issue, ...updates } : issue)),
                    activeSprints: prev.activeSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.map((issue) => (issue.id === issueId ? { ...issue, ...updates } : issue)),
                    })),
                    plannedSprints: prev.plannedSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.map((issue) => (issue.id === issueId ? { ...issue, ...updates } : issue)),
                    })),
                };
            });
        }
    }, [createSnapshot, currentProject]);

    const optimisticUpdateSubTask = useCallback((issueId: string, subtaskId: string, updates: Partial<SubTask>) => {
        createSnapshot();
        setIssues((prev) =>
            prev.map((issue) =>
                issue.id === issueId
                    ? {
                        ...issue,
                        subTasks: issue.subTasks?.map((st) => (st.id === subtaskId ? { ...st, ...updates } : st)),
                    }
                    : issue
            )
        );
    }, [createSnapshot]);

    const optimisticDeleteIssue = useCallback((issueId: string) => {
        createSnapshot();
        // Remove from issues list
        setIssues((prev) => prev.filter((issue) => issue.id !== issueId));

        // Remove from current project if viewing project details
        if (currentProject) {
            setCurrentProject((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    backlog: prev.backlog?.filter((issue) => issue.id !== issueId),
                    activeSprints: prev.activeSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.filter((issue) => issue.id !== issueId),
                    })),
                    plannedSprints: prev.plannedSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.filter((issue) => issue.id !== issueId),
                    })),
                    completedSprints: prev.completedSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.filter((issue) => issue.id !== issueId),
                    })),
                };
            });
        }
    }, [createSnapshot, currentProject]);

    const optimisticDeleteSubTask = useCallback((issueId: string, subtaskId: string) => {
        createSnapshot();
        setIssues((prev) =>
            prev.map((issue) =>
                issue.id === issueId
                    ? {
                        ...issue,
                        subTasks: issue.subTasks?.filter((st) => st.id !== subtaskId),
                    }
                    : issue
            )
        );

        // Also update in current project if viewing project details
        if (currentProject) {
            setCurrentProject((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    backlog: prev.backlog?.map((issue) =>
                        issue.id === issueId
                            ? { ...issue, subTasks: issue.subTasks?.filter((st) => st.id !== subtaskId) }
                            : issue
                    ),
                    activeSprints: prev.activeSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.map((issue) =>
                            issue.id === issueId
                                ? { ...issue, subTasks: issue.subTasks?.filter((st) => st.id !== subtaskId) }
                                : issue
                        ),
                    })),
                    plannedSprints: prev.plannedSprints?.map((sprint) => ({
                        ...sprint,
                        issues: sprint.issues?.map((issue) =>
                            issue.id === issueId
                                ? { ...issue, subTasks: issue.subTasks?.filter((st) => st.id !== subtaskId) }
                                : issue
                        ),
                    })),
                };
            });
        }
    }, [createSnapshot, currentProject]);

    const optimisticAddEmployee = useCallback((projectId: string, employee: Employee) => {
        createSnapshot();
        setEmployees((prev) => [...prev, employee]);
        setEmployeesNotInProject((prev) => prev.filter((emp) => emp.employeeId !== employee.employeeId));
    }, [createSnapshot]);

    // ============================================================================
    // ROLLBACK
    // ============================================================================

    const rollback = useCallback(() => {
        if (snapshot.projects) {
            setProjects(snapshot.projects);
        }
        if (snapshot.currentProject !== undefined) {
            setCurrentProject(snapshot.currentProject);
        }
        if (snapshot.issues) {
            setIssues(snapshot.issues);
        }
        setSnapshot({});
    }, [snapshot]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const value: ProjectContextValue = {
        // State
        projects,
        currentProject,
        issues,
        employees,
        employeesNotInProject,
        departmentId,
        loading,

        // Refresh methods
        refreshProjects,
        refreshProjectDetails,
        refreshIssues,
        refreshEmployees,
        refreshProjectEmployees,

        // Optimistic update methods
        optimisticCreateProject,
        optimisticUpdateProject,
        optimisticDeleteProject,
        optimisticCreateSprint,
        optimisticCreateIssue,
        optimisticUpdateIssue,
        optimisticDeleteIssue,
        optimisticUpdateSubTask,
        optimisticDeleteSubTask,
        optimisticAddEmployee,

        // Rollback
        rollback,
    };

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
