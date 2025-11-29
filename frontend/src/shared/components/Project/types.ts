// components/project/types.ts
export type UserRole = "company" | "manager" | "employee";

export interface EmployeeDTO {
  id: string;
  name: string;
  position: string;
}

export interface SubTaskDTO {
  id: string;
  heading: string;
  description: string;
  hours: number;
  status: string;
  assignedToId: string;
}

export interface IssueDTO {
  id: string;
  heading: string;
  description: string;
  acceptanceCriteria: string;
  size: number;
  type: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  sprintId: string | null;
  subTasks: SubTaskDTO[];
}

export interface SprintDTO {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
  issues: IssueDTO[];
}

export interface ProjectDTO {
  id: string;
  name: string;
  key: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  departmentId: string;
  projectLeadId: string;
  companyId: string;

  backlog: IssueDTO[];
  activeSprints: SprintDTO[];
  plannedSprints: SprintDTO[];
  completedSprints: SprintDTO[];

  assignedEmployee: EmployeeDTO[];

  activeSprintCount: number;
  plannedSprintCount: number;
  completedSprintCount: number;
}