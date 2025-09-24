
export interface CreateSprintDTO {
  name: string;
  description:string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  teamCapacity: number;
  createdBy: string;
  status?: "Planned" | "Active" | "Completed"; 
}
