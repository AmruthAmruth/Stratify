export interface CreateIssuesDTO {
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  estimatedHours: number;
  type: "User Story" | "Bug";
  priority: "Low" | "Medium" | "High";
  projectId: string;
  assignedTo: string | null;
}
