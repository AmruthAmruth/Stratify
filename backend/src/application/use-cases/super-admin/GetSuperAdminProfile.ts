import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class GetSuperAdminProfile {
    constructor(private superAdminRepository: ISuperAdminRepository) { }

    async execute(id: string) {
        const superAdmin = await this.superAdminRepository.findById(id!);
        if (!superAdmin) {
            throw new AppError(Messages.SUPER_ADMIN_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        return {
            id: superAdmin.id,
            email: superAdmin.email,
            name: superAdmin.name,
            profileImage: superAdmin.profileImage,
        };
    }
}
