import { z } from "zod";
import { Messages } from "../../shared/constants/messages";

export const CreateEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: Messages.INVALID_DOB_FORMAT,
  }),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: Messages.INVALID_JOINING_DATE_FORMAT,
  }),
  position: z.string().min(2, "Position is required"),
  gender: z.enum(["male", "female", "other"]),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeProfileSchema = CreateEmployeeSchema.partial();
