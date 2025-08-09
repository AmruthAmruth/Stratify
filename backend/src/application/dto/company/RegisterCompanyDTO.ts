import { z } from "zod";

export const RegisterCompanySchema = z
  .object({
    name: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    industry: z.string().min(2, "Industry is required"),
    description: z.string().min(10, "Description is required"),
    businessRegNo: z
      .string()
      .min(5, "Business registration number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipcode: z.string().min(4, "Zip code is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    profileImage: z
      .string()
      .url("Profile image must be a valid URL")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    
  }); 

export type RegisterCompanyDTO = z.infer<typeof RegisterCompanySchema>;
