export interface EmployeeDTO {
  id?: string; 
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date | string;  
  position: string;
  joiningDate: Date | string;
  managerId?: string;
  profileImage?: string;
  departmentId: string;
  companyId: string;
  password?: string; 
  status?: "active" | "inactive" | "suspended";
  role?: string; 
}