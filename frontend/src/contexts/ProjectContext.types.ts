import type { Issue, Project, SubTask } from '@/types/types';

// ============================================================================
// TYPES
// ============================================================================

export interface Employee {
    employeeId: string;
    name: string;
    position: string;
}

export interface DepartmentEmployeeData {
    departmentId: string;
    employee: Employee[];
}

export interface ProjectsData {
    departmentId?: string;
    projects: Project[];
    counts?: {
        total: number;
        planned: number;
        active: number;
        completed: number;
    };
}

export interface Sprint {
    id?: string;
    _id?: string;
    name: string;
    issues?: Issue[];
    status?: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
}

export interface ProjectDetails extends Project {
    backlog?: Issue[];
    activeSprints?: Sprint[];
    plannedSprints?: Sprint[];
    completedSprints?: Sprint[];
    activeSprintCount?: number;
}

export interface ProjectContextValue {
    // State
    projects: ProjectsData;
    currentProject: ProjectDetails | null;
    issues: Issue[];
    employees: Employee[];
    employeesNotInProject: Employee[];
    departmentId: string;
    loading: {
        projects: boolean;
        projectDetails: boolean;
        issues: boolean;
        employees: boolean;
    };

    // Refresh methods
    refreshProjects: () => Promise<void>;
    refreshProjectDetails: (projectId: string) => Promise<void>;
    refreshIssues: () => Promise<void>;
    refreshEmployees: () => Promise<void>;
    refreshProjectEmployees: (projectId: string) => Promise<void>;

    // Optimistic update methods
    optimisticCreateProject: (project: Partial<Project>) => void;
    optimisticUpdateProject: (projectId: string, updates: Partial<Project>) => void;
    optimisticDeleteProject: (projectId: string) => void;
    optimisticCreateSprint: (projectId: string, sprint: Partial<Sprint>) => void;
    optimisticCreateIssue: (projectId: string, issue: Partial<Issue>) => void;
    optimisticUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
    optimisticDeleteIssue: (issueId: string) => void;
    optimisticUpdateSubTask: (issueId: string, subtaskId: string, updates: Partial<SubTask>) => void;
    optimisticDeleteSubTask: (issueId: string, subtaskId: string) => void;
    optimisticAddEmployee: (projectId: string, employee: Employee) => void;

    // Rollback method for failed operations
    rollback: () => void;
}
