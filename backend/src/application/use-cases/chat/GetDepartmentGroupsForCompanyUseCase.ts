import { IGetDepartmentGroupsForCompanyUseCase, GroupWithMembers, MemberInfo } from "../../interfaces/chat/IGetDepartmentGroupsForCompanyUseCase";
import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { Messages } from '../../../shared/constants/messages';

export class GetDepartmentGroupsForCompanyUseCase implements IGetDepartmentGroupsForCompanyUseCase {
    constructor(
        private groupRepository: IGroupRepository,
        private departmentRepository: IDepartmentRepository,
        private employeeRepository: IEmployeeRepository,
        private managerRepository: IManagerRepository,
        private companyRepository: ICompanyRepository
    ) { }

    async execute(userId: string): Promise<GroupWithMembers[]> {
        
        const company = await this.companyRepository.findById(userId);
        if (!company) {
            throw new Error(Messages.COMPANY_NOT_FOUND);
        }

        
        const departments = await this.departmentRepository.findDepartmentsByCompanyId(company.id!);

        
        const groupsWithMembers: GroupWithMembers[] = [];

        for (const department of departments) {
            
            let group = await this.groupRepository.findByDepartmentId(department.id!);

            
            const members: string[] = [];
            const memberInfos: MemberInfo[] = [];

            
            members.push(userId);
            memberInfos.push({
                id: userId,
                name: company.name,
                role: "manager" 
            });

            
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

            
            const employees = await this.employeeRepository.findByDepartmentId(department.id!);
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
                    department.id!
                );
            } else if (group) {
                
                if (!group.members.includes(userId)) {
                    const updatedMembers = [userId, ...group.members];
                    
                    await this.groupRepository.updateMembers(group.id, updatedMembers);
                    group.members = updatedMembers;
                }
            }

            
            if (group && memberInfos.length > 0) {
                groupsWithMembers.push({
                    id: group.id,
                    name: group.name,
                    members: memberInfos,
                    departmentId: department.id!,
                    createdAt: group.createdAt,
                    updatedAt: group.updatedAt
                });
            }
        }

        return groupsWithMembers;
    }
}
