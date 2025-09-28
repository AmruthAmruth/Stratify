export interface GetProjectsByCompanyDTO {
  id:string | undefined;
  projectName: string;
  projectDescription: string;
  departmentName: string;
  projectLead: string;
  status: "Planned" | "Active" | "Completed" | "Archived";
  remainingTimeInDays: number; 
}

export interface GetProjectsByCompanyResponse {
  projects: GetProjectsByCompanyDTO[];
  counts: {
    total: number;
    planned: number;
    active: number;
    completed: number;
    archived: number;
   
  };
}
