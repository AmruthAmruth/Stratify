import { z } from "zod";

export const CreateManagerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  position: z.string().min(2, "Position is required"),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for joiningDate",
  }),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for dob",
  }),
});

export type CreateManagerDTO = z.infer<typeof CreateManagerSchema>;
