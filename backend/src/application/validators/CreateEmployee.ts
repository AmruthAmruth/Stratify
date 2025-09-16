import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for dob",
  }),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for joiningDate",
  }),
  position: z.string().min(2, "Position is required"),
  gender: z.enum(["male", "female", "other"])
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
