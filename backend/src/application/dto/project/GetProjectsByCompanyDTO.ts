

export interface GetProjectsByCompanyDTO {
  projectName: string;
  projectDescription: string;
  departmentName: string;
  projectLead: string;  
  status: "Planned" | "Active" | "Completed" | "Archived";
  remainingTimeInDays: number; 
}