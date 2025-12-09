import { IGetMyDepartmentGroupUseCase } from "../../interfaces/chat/IGetMyDepartmentGroupUseCase";
import { GroupWithMembers, MemberInfo } from "../../interfaces/chat/IGetDepartmentGroupsForCompanyUseCase";
import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";

export class GetMyDepartmentGroupUseCase implements IGetMyDepartmentGroupUseCase {
    constructor(
        private groupRepository: IGroupRepository,
        private departmentRepository: IDepartmentRepository,
        private employeeRepository: IEmployeeRepository,
        private managerRepository: IManagerRepository
    ) { }

    async execute(userId: string, userRole: "manager" | "employee"): Promise<GroupWithMembers | null> {
        let departmentId: string | undefined;

        
        if (userRole === "manager") {
            const manager = await this.managerRepository.findById(userId);
            if (!manager || !manager.departmentId) {
                return null; 
            }
            departmentId = manager.departmentId;
        } else {
            const employee = await this.employeeRepository.findById(userId);
            if (!employee || !employee.departmentId) {
                return null; 
            }
            departmentId = employee.departmentId;
        }

        
        const department = await this.departmentRepository.findById(departmentId);
        if (!department) {
            return null;
        }

      
        let group = await this.groupRepository.findByDepartmentId(departmentId);

      
        const members: string[] = [];
        const memberInfos: MemberInfo[] = [];

        
        if (department.managerId) {
            const manager = await this.managerRepository.findById(department.managerId);
            if (manager) {
                members.push(manager.id!);
                memberInfos.push({
                    id: manager.id!,
                    name: manager.name,
                    role: "manager"
                });
            }
        }

       
        const employees = await this.employeeRepository.findByDepartmentId(departmentId);
        for (const employee of employees) {
            members.push(employee.id!);
            memberInfos.push({
                id: employee.id!,
                name: employee.name,
                role: "employee"
            });
        }

        
        if (!group && members.length > 0) {
            group = await this.groupRepository.createDepartmentGroup(
                department.name,
                members,
                departmentId
            );
        }

        if (!group || memberInfos.length === 0) {
            return null;
        }

        return {
            id: group.id,
            name: group.name,
            members: memberInfos,
            departmentId: departmentId,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        };
    }
}
