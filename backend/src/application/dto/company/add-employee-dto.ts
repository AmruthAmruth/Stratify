export interface EmployeeDTO {
  id?: string; 
  name: string;
  email: string;
  phone: string;           
 dob: string | Date;         
joiningDate: string | Date;
  position: string;
  managerId?: string;
  profileImage?: string;
  departmentId: string;
  companyId: string;
  password?: string; 
  status?: "active" | "inactive" | "suspended";
  role?: "employee";      
  createdAt?: string;
  updatedAt?: string;
}
