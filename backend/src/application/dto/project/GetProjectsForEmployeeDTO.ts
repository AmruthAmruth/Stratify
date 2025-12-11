export interface GetProjectsForEmployeeDTO {
    id: string | undefined;
    projectName: string;
    projectDescription: string;
    status: "Planned" | "Active" | "Completed" | "Archived";
    remainingTimeInDays: number;
}

export interface GetProjectsForEmployeeResponse {
    projects: GetProjectsForEmployeeDTO[];
    employeeId: string | undefined;
    counts: {
        total: number;
        planned: number;
        active: number;
        completed: number;
        archived: number;
    };
}
