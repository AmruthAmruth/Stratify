import { z } from "zod";

export const CreatePlanSchema = z.object({
  plan: z.string().min(2, "Plan name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  amount: z.number().positive("Amount must be greater than 0"),
  durationInMonths: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0"),
});


export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>;
