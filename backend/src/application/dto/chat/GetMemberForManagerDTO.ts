export interface MemberDTO {
  id: string;
  name: string;
  position: string;
  role: string;
}

export interface GetMemberForMangerDTO {
  company: {
    id: string | undefined;
    name: string;
  };
  managers: MemberDTO[];
  employees: MemberDTO[];
}
