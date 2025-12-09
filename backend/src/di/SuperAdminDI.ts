import { SuperAdminRepository } from "../infrastructure/repositories/SuperAdminRepository";
import { GetSuperAdminProfile } from "../application/use-cases/super-admin/GetSuperAdminProfile";
import { UpdateSuperAdminProfile } from "../application/use-cases/super-admin/UpdateSuperAdminProfile";
import { SuperAdminController } from "../interfaces/controllers/SuperAdminController";

export const superAdminDI = () => {
    const superAdminRepo = new SuperAdminRepository();

    const getSuperAdminProfile = new GetSuperAdminProfile(superAdminRepo);
    const updateSuperAdminProfile = new UpdateSuperAdminProfile(superAdminRepo);

    return new SuperAdminController(
        getSuperAdminProfile,
        updateSuperAdminProfile
    );
};
