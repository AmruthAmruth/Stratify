export interface CreateSubTaskDTO {
  issueId: string;
  heading: string;
  description: string;
  hours: number;
  status?: "To Do" | "In Progress" | "Done" | "Blocked";
  assignedToId?: string | null;
}