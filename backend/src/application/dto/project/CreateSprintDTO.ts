export interface CreateSprintDTO {
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
  status?: "Planned" | "Active" | "Completed";
}
