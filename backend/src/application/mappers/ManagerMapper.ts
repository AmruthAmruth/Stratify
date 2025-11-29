import { Manager } from "../../domain/entities/Manager";
import { CreateManagerDTO } from "../dto/managers/CreateManagerDTO";

export class ManagerMapper {

    static toDomain(
        dto: CreateManagerDTO,
        hashedPassword: string,
    ): Manager {
        return new Manager(
            undefined,
            dto.name,
            dto.email,
            dto.phone,
            hashedPassword,
            "manager",
            dto.position,
            dto.joiningDate,
            dto.gender,
            dto.dob,
            dto.companyId,
            dto.departmentId,
            dto.profileImage,
        );
    }

    static toResponse(manager: Manager) {
        return {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            role: manager.role,
            position: manager.position,
            joiningDate: manager.joiningDate,
            gender: manager.gender,
            dob: manager.dob,
            companyId: manager.companyId,
            departmentId: manager.departmentId,
            profileImage: manager.profileImage,
        };
    }

    static toUnassignedManagerDTO(manager: Manager) {
        return {
            id: manager.id!,
            name: manager.name,
            email: manager.email,
            position: manager.position,
        };
    }

    static toListResponse(managers: Manager[]) {
        return managers.map((manager) => this.toResponse(manager));
    }
}
