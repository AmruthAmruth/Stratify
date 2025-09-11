export interface BaseUserDTO {
  name: string;
  email: string;
  phone: string;
}

export interface PersonDTO extends BaseUserDTO {
  dob: string;          
  gender: "male" | "female" | "other";
  joiningDate: string;   
  profileImage?: string;
}

export interface RegisterCompanyDTO extends BaseUserDTO {
  industry: string;
  description?: string;
  businessRegNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;      
  profileImage?: string;
}

export interface CreateManagerDTO extends PersonDTO {
  department: string;
  employeeId: string;    
  companyId: string;      
  password?: string;     
}

export interface CreateEmployeeDTO extends PersonDTO {
  designation: string;
  employeeId: string;     
  companyId: string;    
  managerId?: string;     
  password?: string;      
}

export type RegisterUserDTO =
  | RegisterCompanyDTO
  | CreateManagerDTO
  | CreateEmployeeDTO;
