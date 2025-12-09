import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";

export class GetSuperAdminProfile {
    constructor(private superAdminRepository: ISuperAdminRepository) { }

    async execute(id: string) {
        const superAdmin = await this.superAdminRepository.findById(id!);
        if (!superAdmin) {
            throw new Error("Super Admin not found");
        }

        return {
            id: superAdmin.id,
            email: superAdmin.email,
            name: superAdmin.name,
            profileImage: superAdmin.profileImage,
        };
    }
}
