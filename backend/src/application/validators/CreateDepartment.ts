import { z } from "zod";

export const DepartmentDetailsSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().optional(),
  managerName: z.string().optional(),
});

export type DepartmentDetails = z.infer<typeof DepartmentDetailsSchema>;
