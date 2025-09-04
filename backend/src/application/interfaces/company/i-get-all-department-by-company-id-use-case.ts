export interface IGetAllDepartmentByCompanyId {
  execute(companyId: string): Promise<CompanyDepartmentSummary>;
}

export interface DepartmentDetails {
  departmentName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  employeeCount: number;
}

export interface CompanyDepartmentSummary {
  companyName: string;
  totalDepartments: number;
  totalEmployees: number;
  departments: DepartmentDetails[];
}