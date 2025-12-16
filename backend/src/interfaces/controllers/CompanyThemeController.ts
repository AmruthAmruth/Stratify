import { Request, Response } from "express";
import { IGetCompanyThemeUseCase } from "../../application/use-cases/company/GetCompanyThemeUseCase";
import { IUpdateCompanyThemeUseCase, UpdateThemeDTO } from "../../application/use-cases/company/UpdateCompanyThemeUseCase";
import { IGetThemePresetsUseCase } from "../../application/use-cases/company/GetThemePresetsUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { AppError } from "../middleware/ErrorMiddleware";

export class CompanyThemeController {
    constructor(
        private getCompanyThemeUseCase: IGetCompanyThemeUseCase,
        private updateCompanyThemeUseCase: IUpdateCompanyThemeUseCase,
        private getThemePresetsUseCase: IGetThemePresetsUseCase
    ) { }

    /**
     * GET /api/company/theme/:companyId
     * Get theme for a specific company
     */
    getCompanyTheme = async (req: Request, res: Response): Promise<void> => {
        try {
            const { companyId } = req.params;

            if (!companyId) {
                throw new AppError("Company ID is required", StatusCodes.BAD_REQUEST);
            }

            const theme = await this.getCompanyThemeUseCase.execute(companyId);

            if (!theme) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Theme not found for this company"
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                success: true,
                response: theme,
                message: "Company theme retrieved successfully"
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * PUT /api/company/theme
     * Update company theme (company admin only)
     */
    updateCompanyTheme = async (req: Request, res: Response): Promise<void> => {
        try {
            const role = (req as { role?: string }).role;
            const userId = (req as { userId?: string }).userId;

            // Only company admins can update theme
            if (role !== 'company') {
                throw new AppError(
                    "Only company administrators can update themes",
                    StatusCodes.FORBIDDEN
                );
            }

            if (!userId) {
                throw new AppError("User ID is required", StatusCodes.UNAUTHORIZED);
            }

            const themeData: UpdateThemeDTO = req.body;

            // Validate required fields
            if (!themeData.themeName || !themeData.themeMode ||
                !themeData.primaryColor || !themeData.secondaryColor ||
                !themeData.accentColor) {
                throw new AppError(
                    "Missing required theme fields",
                    StatusCodes.BAD_REQUEST
                );
            }

            const updatedTheme = await this.updateCompanyThemeUseCase.execute(
                userId,
                themeData
            );

            res.status(StatusCodes.OK).json({
                success: true,
                response: updatedTheme,
                message: "Company theme updated successfully"
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * GET /api/company/theme-presets
     * Get available theme presets
     */
    getThemePresets = async (_req: Request, res: Response): Promise<void> => {
        try {
            const presets = await this.getThemePresetsUseCase.execute();

            res.status(StatusCodes.OK).json({
                success: true,
                response: presets,
                message: "Theme presets retrieved successfully"
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * POST /api/company/theme/apply-preset
     * Apply a preset theme to company
     */
    applyPreset = async (req: Request, res: Response): Promise<void> => {
        try {
            const role = (req as { role?: string }).role;
            const userId = (req as { userId?: string }).userId;

            if (role !== 'company') {
                throw new AppError(
                    "Only company administrators can apply themes",
                    StatusCodes.FORBIDDEN
                );
            }

            if (!userId) {
                throw new AppError("User ID is required", StatusCodes.UNAUTHORIZED);
            }

            const { presetName } = req.body;

            if (!presetName) {
                throw new AppError("Preset name is required", StatusCodes.BAD_REQUEST);
            }

            // Get all presets and find the selected one
            const presets = await this.getThemePresetsUseCase.execute();
            const selectedPreset = presets.find(p => p.name === presetName);

            if (!selectedPreset) {
                throw new AppError("Invalid preset name", StatusCodes.BAD_REQUEST);
            }

            // Apply as theme update
            const themeData: UpdateThemeDTO = {
                themeName: selectedPreset.name,
                themeMode: selectedPreset.mode,
                primaryColor: selectedPreset.primaryColor,
                secondaryColor: selectedPreset.secondaryColor,
                accentColor: selectedPreset.accentColor,
                backgroundColor: selectedPreset.backgroundColor,
                textColor: selectedPreset.textColor,
                isCustom: false,
            };

            const updatedTheme = await this.updateCompanyThemeUseCase.execute(
                userId,
                themeData
            );

            res.status(StatusCodes.OK).json({
                success: true,
                response: updatedTheme,
                message: `Preset theme "${presetName}" applied successfully`
            });
        } catch (error) {
            throw error;
        }
    };
}
