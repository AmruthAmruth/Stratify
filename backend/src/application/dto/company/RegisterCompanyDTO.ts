import { z } from "zod";

export const RegisterCompanySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  industry: z.string().min(2, "Industry is required"),
  description: z.string().optional(),
  businessRegNo: z.string().min(3, "Business Registration No is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipcode: z.string().min(4, "Zipcode is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.string().url("Profile image must be a valid URL").optional(),
});

export type RegisterCompanyDTO = z.infer<typeof RegisterCompanySchema>;
