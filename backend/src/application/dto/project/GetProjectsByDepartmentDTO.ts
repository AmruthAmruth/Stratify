export interface GetProjectsByDepartmentDTO {
  projectName: string;
  projectDescription: string;
  status: "Planned" | "Active" | "Completed" | "Archived";
  remainingTimeInDays: number;
}


export interface GetProjectsByDepartmentResponse {
  projects: GetProjectsByDepartmentDTO[];
  counts: {
    total: number;
    planned: number;
    active: number;
    completed: number;
    archived: number;
  };
}
