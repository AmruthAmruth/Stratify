export interface EmployeeIssueDTO {
    id: string;
    heading: string;
    description: string;
    acceptanceCriteria: string;
    size: number;
    estimatedHours: number;
    type: "User Story" | "Bug";
    status: "Planned" | "In Progress" | "Done" | "Blocked";
    priority: "Low" | "Medium" | "High";
    projectId: string;
    projectName: string;
    sprintId: string | null;
    assignedTo: string | null;
    subTasks: SubTaskDTO[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SubTaskDTO {
    id: string;
    title: string;
    description?: string;
    estimatedHours?: number;
    status: string;
}
