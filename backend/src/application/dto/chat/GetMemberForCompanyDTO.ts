export interface MemberDTO {
  id: string;
  name: string;
  position: string;
  role: string;
}

export interface GetMemberForCompanyDTO {
  company: {
    id: string | undefined;
    name: string;
  };
  managers: MemberDTO[];
  employees: MemberDTO[];
}
