import { Employee } from "../../domain/entities/Employee";
import { CreateEmployeeDTO } from "../dto/employees/CreateEmployeeDTO";
import { TeamMemberDTO } from "../dto/departments/DepartmentDetailsDTO"; 
export class EmployeeMapper {
  
  static toDomain(
    dto: CreateEmployeeDTO,
    hashedPassword: string,
    companyId: string,
    managerId?: string,
  ): Employee {
    return new Employee(
      undefined,
      dto.name,
      dto.email,
      dto.phone,
      dto.dob,
      dto.joiningDate,
      dto.position,
      hashedPassword,
      companyId,
      dto.departmentId,
      dto.gender,
      "employee",
      dto.managerId || managerId,
      dto.profileImage,
    );
  }

  static toTeamMemberDTO(employee: Employee): TeamMemberDTO {
    return {
      id: employee.id,
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
    };
  }
}