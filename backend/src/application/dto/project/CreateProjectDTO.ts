export interface CreateProjectDTO {
  name: string;
  key: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  departmentId: string;
  createdBy: string;
  status?: "Planned" | "Active" | "Completed" | "Archived";
}
