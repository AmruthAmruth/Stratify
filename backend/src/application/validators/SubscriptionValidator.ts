import { z } from "zod";

export const PurchasePlanSchema = z.object({
    planName: z.string().min(1, "Plan name is required"),
});

export const VerifyPaymentSchema = z.object({
    planName: z.string().min(1, "Plan name is required"),
    orderId: z.string().min(1, "Order ID is required"),
    paymentId: z.string().min(1, "Payment ID is required"),
    signature: z.string().min(1, "Signature is required"),
});

export const PurchasePlanUnauthenticatedSchema = PurchasePlanSchema.extend({
    companyId: z.string().min(1, "Company ID is required"),
});

export const VerifyPaymentUnauthenticatedSchema = VerifyPaymentSchema.extend({
    companyId: z.string().min(1, "Company ID is required"),
});

export const UpdatePlanSchema = z.object({
    plan: z.string().min(1, "Plan name is required"),
    description: z.string().min(5, "Description must be at least 5 characters").optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    durationInMonths: z
        .number()
        .int("Duration must be an integer")
        .positive("Duration must be greater than 0")
        .optional(),
});

export const DeletePlanSchema = z.object({
    plan: z.string().min(1, "Plan name is required"),
});
