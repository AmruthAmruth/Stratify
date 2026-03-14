import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "../../shared/constants/statusCodes";

export const validateRequest = (schema: z.ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: "error",
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};
