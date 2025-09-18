import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    industry: z.string().min(1, "Industry is required"),
    description: z.string().min(1, "Description is required").optional(),
    businessRegNo: z.string().min(1, "Business Reg. No is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipcode: z.string().min(1, "Zipcode is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),

    profileImage: z
      .instanceof(File)
      .refine(file => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});



export const addDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().min(1, "Description is required").optional(),
});



export const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\+?[0-9\s]+$/, "Phone number must contain only digits and optional +"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid joining date",
  }),
  position: z.string().min(1, "Position is required"),
  departmentId: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
});



export const addPlanSchema = z.object({
  plan: z.string().min(1, "Plan is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(499, "Amount must be >= 499"),
  durationInMonths: z.coerce.number().min(1, "Duration must be >= 1 month"),
});


export const rejectionValidationSchema=z.object({
  reason: z.string().min(1, "Reason is required"),
 
});