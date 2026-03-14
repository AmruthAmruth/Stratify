import { z } from "zod";

export const UpdateManagerProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must not exceed 50 characters").optional(),
    phone: z.string().min(7, "Phone number must be at least 7 characters").max(15, "Phone number must not exceed 15 characters").optional(),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
