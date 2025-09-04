export interface AddDepartmentWithManagerResponse {
  department: {
    id: string;
    name: string;
     discription?: string; 
    companyId: string;
    managerId: string;
  };
  manager: {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyId: string;
    departmentId: string;
    role: string;
    status: string;
  };
}
