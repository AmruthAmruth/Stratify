export interface ManagerDepartmentResponseDTO {
  id: string;           
  name: string;         
  memberCount: number;  
  status: "Active" | "Inactive"; 
}