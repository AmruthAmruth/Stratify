


export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  joiningDate: Date;
  dob: Date;
  gender: "male" | "female" | "other";
  companyId: string;
  companyName?: string;        
  departmentId?: string;
  departmentName?: string;      
  managerId?: string;           
  managerName?: string;        
  profileImage?: string;
  role: "Manager" | "Employee"; 
}