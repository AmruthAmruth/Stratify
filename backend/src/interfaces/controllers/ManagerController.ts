import { Response } from "express";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { IGetManagerProfileUseCase } from "../../application/interfaces/managers/IGetManagerProfileUseCase";
import { IUpdateManagerProfileUseCase } from "../../application/interfaces/managers/IUpdateManagerProfileUseCase";
import { IChangeManagerPasswordUseCase } from "../../application/interfaces/managers/IChangeManagerPasswordUseCase";
import { IGetDepartmentEmployeesUseCase } from "../../application/interfaces/managers/IGetDepartmentEmployeesUseCase";
import { IGetTeamAnalyticsUseCase } from "../../application/interfaces/managers/IGetTeamAnalyticsUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class ManagerController {
    constructor(
        private getManagerProfileUseCase: IGetManagerProfileUseCase,
        private updateManagerProfileUseCase: IUpdateManagerProfileUseCase,
        private changeManagerPasswordUseCase: IChangeManagerPasswordUseCase,
        private getDepartmentEmployeesUseCase: IGetDepartmentEmployeesUseCase,
        private getTeamAnalyticsUseCase: IGetTeamAnalyticsUseCase
    ) { }

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const managerId = req.userId!;
            const manager = await this.getManagerProfileUseCase.execute(managerId);
            res.status(StatusCodes.OK).json({ manager });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Failed to fetch profile",
            });
        }
    };

    updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const managerId = req.userId!;
            const data = req.body;

            
            if (req.file) {
                data.profileImage = `/uploads/${req.file.filename}`;
            }

            const manager = await this.updateManagerProfileUseCase.execute(managerId, data);
            res.status(StatusCodes.OK).json({
                message: Messages.PROFILE_UPDATE_SUCCESS,
                manager,
            });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Failed to update profile",
            });
        }
    };

    changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const managerId = req.userId!;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: Messages.PASSWORD_FIELDS_REQUIRED,
                });
                return;
            }

            await this.changeManagerPasswordUseCase.execute(
                managerId,
                currentPassword,
                newPassword
            );

            res.status(StatusCodes.OK).json({
                message: Messages.PASSWORD_CHANGE_SUCCESS,
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "Current password is incorrect") {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error instanceof Error ? error.message : "Failed to change password",
                });
            }
        }
    };

    getDepartmentEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const managerId = req.userId!;
            const employees = await this.getDepartmentEmployeesUseCase.execute(managerId);
            res.status(StatusCodes.OK).json({ employees });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Failed to fetch department employees",
            });
        }
    };

    getTeamAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const managerId = req.userId!;
            const analytics = await this.getTeamAnalyticsUseCase.execute(managerId);
            res.status(StatusCodes.OK).json({ analytics });
        } catch (error: unknown) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : "Failed to fetch team analytics",
            });
        }
    };
}
