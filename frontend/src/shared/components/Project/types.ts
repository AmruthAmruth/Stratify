// components/project/types.ts
export type UserRole = "company" | "manager" | "employee";

export interface EmployeeDTO {
  id: string;
  name: string;
  position: string;
  employeeId?: string;
  [key: string]: unknown;
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
  estimatedHours?: number;
  assignedTo: string | null;
  sprintId: string | null;
  subTasks: SubTaskDTO[];
  [key: string]: unknown;
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
  [key: string]: unknown;
}

// Alias for backward compatibility
export type ProjectDetailsDTO = ProjectDTO;

// Allocation details for a project
export interface AllocationDetails {
  percentage?: number;
  hoursPerWeek?: number;
  allocationPercent?: number;
  startDate?: string;
  endDate?: string;
}

// Forecast allocation details
export interface ForecastAllocationDetails {
  forecastHours?: number;
  actualHours?: number;
  forecastHoursPerWeek?: number;
  startDate?: string;
  endDate?: string;
}

// Forecast vs actual comparison
export interface ForecastVsActualDetails {
  variance?: number;
  status?: string;
  variancePercent?: number;
  leaveHours?: number;
  utilizationPercent?: number;
}

// Employee with allocation information
export interface EmployeeWithAllocation {
  id: string;
  name: string;
  position: string;
  allocationPercentage?: number;
  hoursPerWeek?: number;
  totalAllocatedHours?: number;
  forecastHours?: number;
  allocation?: AllocationDetails;
  forecastAllocation?: ForecastAllocationDetails;
  forecastVsActual?: ForecastVsActualDetails;
  totalAllocatedPercent?: number;
}