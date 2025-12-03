import { IChangeManagerPasswordUseCase } from "../../interfaces/managers/IChangeManagerPasswordUseCase";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import bcrypt from "bcryptjs";

export class ChangeManagerPasswordUseCase implements IChangeManagerPasswordUseCase {
    constructor(private managerRepository: IManagerRepository) { }

    async execute(managerId: string, currentPassword: string, newPassword: string): Promise<void> {
        const manager = await this.managerRepository.findById(managerId);

        if (!manager) {
            throw new Error("Manager not found");
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, manager.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.managerRepository.updatePassword(manager.email, hashedPassword);
    }
}
