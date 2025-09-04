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
  departmentName: z.string().min(2, "Department name must be at least 2 characters"),
  departmentDescription: z.string().min(1, "Description is required").optional(),
  departmentStatus: z.enum(["active", "inactive"], {
    required_error: "Please select a department status",
  }),
  managerName: z.string().min(2, "Manager name must be at least 2 characters"),
  managerEmail: z.string().email("Invalid email address"),
  managerPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"), // allows + and 10–15 digits
  managerJoiningDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    })
    .optional(),
    managerProfileImage: z
      .instanceof(File)
      .refine(file => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .optional(),
});


export const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  position: z.string().min(1, "Position is required"),
  status: z.enum(["active", "inactive", "suspended"], {
    required_error: "Status is required",
  }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  joinDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid joining date",
  }),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .optional(),
});