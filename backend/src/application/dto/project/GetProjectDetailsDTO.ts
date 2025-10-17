export interface ProjectDetailsDTO {
  id: string;
  name: string;
  key: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "Planned" | "Active" | "Completed" | "Archived";
  departmentId: string;
  projectLeadId: string;
  companyId: string;

  backlog: IssueDTO[];
  activeSprints: SprintWithIssuesDTO[];
  plannedSprints: SprintWithIssuesDTO[];
  completedSprints: SprintWithIssuesDTO[];

  activeSprintCount: number;
  plannedSprintCount: number;
  completedSprintCount: number;
}

export interface SprintWithIssuesDTO {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: "Planned" | "Active" | "Completed";
  issues: IssueDTO[];
}

export interface IssueDTO {
  id: string;
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  estimatedHours: number;
  type: "User Story" | "Bug";
  status: "Planned" | "In Progress" | "Done" | "Blocked";
  priority: "Low" | "Medium" | "High";
  assignedTo?: string | null;
  sprintId?: string | null;
  subTasks?: SubTaskDTO[];
}

export interface SubTaskDTO {
  id: string;
  heading: string;
  description: string;
  hours: number;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  assignedToId?: string | null;
}
