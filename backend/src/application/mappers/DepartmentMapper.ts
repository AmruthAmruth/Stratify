import { Department } from "../../domain/entities/Department";
import { Employee } from "../../domain/entities/Employee"; 
import { CreateDepartmentDTO } from "../dto/departments/CreateDepartmentDTO";
import { DepartmentDetails } from "../dto/departments/CompanyDepartmentsDTO";
import { DepartmentDetailsDTO, TeamMemberDTO } from "../dto/departments/DepartmentDetailsDTO";
import { ManagerDepartmentResponseDTO } from "../dto/departments/ManagerDepartmentResponseDTO";
import { UnassignedDepartmentDTO } from "../dto/departments/UnassignedDepartmentDTO";

export class DepartmentMapper {
  
  static toDomain(dto: CreateDepartmentDTO): Department {
    return new Department(
      undefined,
      dto.name,
      dto.description,
      dto.companyId,
      dto.managerId,
      new Date(),
      new Date(),
    );
  }

  static toCompanyDepartmentDTO(
    entity: Department,
    managerName: string,
    numOfEmployees: number,
  ): DepartmentDetails {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      managerName,
      numOfEmployees,
    };
  }

  static toDepartmentDetailsDTO(
    entity: Department,
    headOfDepartment?: string,
    headEmail?: string,
    headPhone?: string,
    headPosition?: string,
    teamMembers: TeamMemberDTO[] = [],
  ): DepartmentDetailsDTO {
    return {
      departmentName: entity.name,
      description: entity.description ?? "",
      headOfDepartment,
      headEmail,
      headPhone,
      headPosition,
      teamMembers,
    };
  }

  static toTeamMemberDTOs(employees: Employee[]): TeamMemberDTO[] {
    return employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      email: emp.email,
      phone: emp.phone,
    }));
  }

  static toManagerDepartmentDTO(
    entity: Department,
    memberCount: number,
  ): ManagerDepartmentResponseDTO {
    return {
      id: entity.id!,
      name: entity.name,
      memberCount,
      status: "Active",
    };
  }

  static toUnassignedDepartmentDTO(
    entity: Department,
  ): UnassignedDepartmentDTO {
    return {
      id: entity.id!,
      name: entity.name,
    };
  }
}
