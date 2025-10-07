
export interface ProjectLevelEmployeeAllocationDTO { 
  departmentId: string;
  employee: {
    name: string;
    position: string;
    employeeId: string;
  }[];
}