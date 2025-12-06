
export interface IGetDepartmentGroupsForCompanyUseCase {
    execute(userId: string): Promise<GroupWithMembers[]>;
}

export interface GroupWithMembers {
    id: string;
    name: string;
    members: MemberInfo[];
    departmentId: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface MemberInfo {
    id: string;
    name: string;
    role: "manager" | "employee";
}
