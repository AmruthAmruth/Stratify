

export interface TeamMemberDTO {
  id:string | undefined;
  name: string;
  position: string;
  email: string;
  phone: string;
}

export interface DepartmentDetailsDTO {
  departmentName: string;
  description: string;

  headOfDepartment?: string;
  headEmail?: string;
  headPhone?: string;
  headPosition?: string;

  teamMembers: TeamMemberDTO[];
}
