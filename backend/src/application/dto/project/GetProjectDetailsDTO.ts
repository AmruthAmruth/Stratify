export interface TaskDTO {
  name: string;
  description: string;
  status: "Planned" | "InProgress" | "Completed";
}




export interface UserStoryDTO {
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Planned" | "InProgress" | "Completed";
  storyPoints: number;
  assignedTo: string; 
  tasks: TaskDTO[];
}



export interface BacklogDTO {
  name: string;
  description: string;
  numberOfEmployees: number;
  userStories: UserStoryDTO[];
}



export interface SprintDTO {
  name: string;
  description:string,
  startDate: Date;
  endDate: Date;
  teamCapacity: number;
  totalStoryPoints:number;
  status: "Planned" | "Active" | "Completed";
  userStories: UserStoryDTO[];
}


export interface ProjectDetailsDTO {
  name: string;
  key: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "Planned" | "Active" | "Completed" | "Archived";
  projectLead: string;
  totalTeamMembers: number;
  remainingDays: number;
  backlogs: BacklogDTO[];
  sprints: SprintDTO[];
}
