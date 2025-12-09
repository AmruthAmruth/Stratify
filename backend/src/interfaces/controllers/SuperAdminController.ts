import { Response } from "express";
import { GetSuperAdminProfile } from "../../application/use-cases/super-admin/GetSuperAdminProfile";
import { UpdateSuperAdminProfile } from "../../application/use-cases/super-admin/UpdateSuperAdminProfile";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";

export class SuperAdminController {
    constructor(
        private getSuperAdminProfile: GetSuperAdminProfile,
        private updateSuperAdminProfile: UpdateSuperAdminProfile
    ) { }

    getProfile = async (req: AuthRequest, res: Response) => {
        const id = req.userId!;
        const profile = await this.getSuperAdminProfile.execute(id);
        res.status(StatusCodes.OK).json(profile);
    };

    updateProfile = async (req: AuthRequest, res: Response) => {
        const id = req.userId!;
        const { name } = req.body;
        let { profileImage } = req.body;

        if (req.file) {
            profileImage = req.file.path;
        }

        const updatedProfile = await this.updateSuperAdminProfile.execute(id, {
            name,
            profileImage,
        });
        res.status(StatusCodes.OK).json(updatedProfile);
    };
}
