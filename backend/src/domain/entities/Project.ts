
export type ProjectStatus = "Planned" | "Active" | "Completed" | "Archived";



export class Project {
  constructor(
    public readonly id: string,
    public name: string,
    public key: string,               
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public status: ProjectStatus = "Planned",
    public departmentId: string,        
    public projectLeadId: string,       
    public assignedEmployeeIds: string[] = [], 
    public backlogIds: string[] = [],   
    public sprintIds: string[] = [],    
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

   assignEmployee(employeeId: string) {
    if (!this.assignedEmployeeIds.includes(employeeId)) {
      this.assignedEmployeeIds.push(employeeId);
      this.updatedAt = new Date();
    }
  }

  removeEmployee(employeeId: string) {
    this.assignedEmployeeIds = this.assignedEmployeeIds.filter(id => id !== employeeId);
    this.updatedAt = new Date();
  }

  updateStatus(status: ProjectStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }
}