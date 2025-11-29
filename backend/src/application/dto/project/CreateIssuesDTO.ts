export interface CreateIssuesDTO {
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  type: "User Story" | "Bug";
  priority: "Low" | "Medium" | "High";
  projectId: string;
  assignedTo: string | null;
}


export interface UpdateIssueDTO {
  id: string;
  heading?: string;
  description?: string;
  acceptanceCriteria?: string;
  size?: number;
  type?: "User Story" | "Bug";
  priority?: "Low" | "Medium" | "High";
  assignedTo?: string | null;
}