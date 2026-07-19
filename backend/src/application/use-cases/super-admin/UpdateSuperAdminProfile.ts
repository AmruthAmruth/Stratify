import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { SuperAdmin } from "../../../domain/entities/SuperAdmin";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
  IUpdateSuperAdminProfileUseCase,
  SuperAdminProfileResponse,
} from "../../../application/interfaces/super-admin/IUpdateSuperAdminProfileUseCase";

export class UpdateSuperAdminProfile implements IUpdateSuperAdminProfileUseCase {
    constructor(private superAdminRepository: ISuperAdminRepository) { }

    async execute(id: string, data: { name?: string; profileImage?: string }): Promise<SuperAdminProfileResponse> {
        const superAdmin = await this.superAdminRepository.findById(id);
        if (!superAdmin) {
            throw new AppError(Messages.SUPER_ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);
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
