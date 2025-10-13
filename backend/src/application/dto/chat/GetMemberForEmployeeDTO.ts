export interface MemberDTO {
  id: string;
  name: string;
  position: string;
  role: string;
}

export interface GetMemberForEmployee {
  company: {
    id: string | undefined;
    name: string;
  };
  manager: {
    id: string | undefined;
    name: string;
  };
  employees: MemberDTO[];
}
