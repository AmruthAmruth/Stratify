import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { SuperAdmin } from "../../../domain/entities/SuperAdmin";

export class UpdateSuperAdminProfile {
    constructor(private superAdminRepository: ISuperAdminRepository) { }

    async execute(id: string, data: { name?: string; profileImage?: string }) {
        const superAdmin = await this.superAdminRepository.findById(id);
        if (!superAdmin) {
            throw new Error("Super Admin not found");
        }

        const updatedSuperAdmin = new SuperAdmin(
            superAdmin.id,
            superAdmin.email,
            superAdmin.password,
            data.name || superAdmin.name,
            data.profileImage || superAdmin.profileImage
        );

        await this.superAdminRepository.update(updatedSuperAdmin);

        return {
            id: updatedSuperAdmin.id,
            email: updatedSuperAdmin.email,
            name: updatedSuperAdmin.name,
            profileImage: updatedSuperAdmin.profileImage,
        };
    }
}
