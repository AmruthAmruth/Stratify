export interface GetProjectsByDepartmentDTO {
  projectName: string;
  projectDescription: string;
  status: "Planned" | "Active" | "Completed" | "Archived";
  remainingTimeInDays: number;
}