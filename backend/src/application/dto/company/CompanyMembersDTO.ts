export interface MemberDTO {
  name: string;
  department?: string;
  position: string;
  email: string;
  phone: string;
  role: "Employee" | "Manager";
}

export interface CompanyMembersDTO {
  totalEmployees: number;
  totalManagers: number;
  employees: MemberDTO[];
  managers: MemberDTO[];
}
