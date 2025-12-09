import { IChangeManagerPasswordUseCase } from "../../interfaces/managers/IChangeManagerPasswordUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import bcrypt from "bcryptjs";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { Messages } from "../../../shared/constants/messages";

export class ChangeManagerPasswordUseCase implements IChangeManagerPasswordUseCase {
    constructor(private managerRepository: IManagerRepository) { }

    async execute(managerId: string, currentPassword: string, newPassword: string): Promise<void> {
        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new AppError(Messages.MANAGER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }


        const isPasswordValid = await bcrypt.compare(currentPassword, manager.password);
        if (!isPasswordValid) {
            throw new AppError(Messages.INCORRECT_PASSWORD, StatusCodes.UNAUTHORIZED);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);


        await this.managerRepository.updatePassword(manager.email, hashedPassword);
    }
}
