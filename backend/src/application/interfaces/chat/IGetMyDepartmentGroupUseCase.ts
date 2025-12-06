import { GroupWithMembers } from "./IGetDepartmentGroupsForCompanyUseCase";

export interface IGetMyDepartmentGroupUseCase {
    execute(userId: string, userRole: "manager" | "employee"): Promise<GroupWithMembers | null>;
}
