import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";
import {
  IGetSuperAdminProfileUseCase,
  SuperAdminProfileResponse,
} from "../../interfaces/super-admin/IGetSuperAdminProfileUseCase";

export class GetSuperAdminProfile implements IGetSuperAdminProfileUseCase {
    constructor(private superAdminRepository: ISuperAdminRepository) { }

    async execute(id: string): Promise<SuperAdminProfileResponse> {
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
