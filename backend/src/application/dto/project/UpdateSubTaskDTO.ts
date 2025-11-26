export interface UpdateSubTaskDTO {
    id: string;
    heading: string;
    description: string;
    hours: number;
    status?: "To Do" | "In Progress" | "Done";
    assignedToId?: string | null;
}
