import { IUpdateManagerProfileUseCase } from "../../interfaces/managers/IUpdateManagerProfileUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { UpdateManagerProfileData, UpdateManagerProfileResponse } from "../../interfaces/managers/types";
import { Manager } from "../../../domain/entities/Manager";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class UpdateManagerProfileUseCase implements IUpdateManagerProfileUseCase {
    constructor(private managerRepository: IManagerRepository) { }

    async execute(managerId: string, data: UpdateManagerProfileData): Promise<UpdateManagerProfileResponse> {
        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updateData: Partial<Manager> = {};

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;
        if (data.dateOfBirth) updateData.dob = new Date(data.dateOfBirth);
        if (data.profileImage) updateData.profileImage = data.profileImage;
        if (data.address !== undefined) updateData.address = data.address;

        const updatedManager = await this.managerRepository.updatePartial(managerId, updateData);

        if (!updatedManager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND); // Changed from MANAGER_UPDATE_FAILED
        }

        return {
            id: updatedManager.id!,
            name: updatedManager.name,
            email: updatedManager.email,
            phone: updatedManager.phone,
            dateOfBirth: updatedManager.dob ? updatedManager.dob.toISOString() : undefined,
            profileImage: updatedManager.profileImage,
            address: updatedManager.address,
        };
    }
}
