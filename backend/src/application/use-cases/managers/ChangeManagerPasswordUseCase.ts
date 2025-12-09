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

     
        const isPasswordValid = await bcrypt.compare(currentPassword, manager.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await this.managerRepository.updatePassword(manager.email, hashedPassword);
    }
}
