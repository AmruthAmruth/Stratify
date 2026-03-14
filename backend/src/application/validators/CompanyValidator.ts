import { z } from "zod";
import { RegisterCompanyDTO } from "../dto/company/CreateCompanyDTO";

const RegisterCompanySchemaBase = z.object({
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

export const RegisterCompanySchema: z.ZodType<RegisterCompanyDTO> = RegisterCompanySchemaBase;

export const ApproveCompanySchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
});

export const UnapproveCompanySchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  reason: z.string().min(1, "Reason is required"),
});

export const UpdateCompanyProfileSchema = RegisterCompanySchemaBase.partial();

export const UpdateThemeSchema = z.object({
  themeName: z.string().min(1, "Theme name is required"),
  themeMode: z.string().min(1, "Theme mode is required"),
  primaryColor: z.string().min(1, "Primary color is required"),
  secondaryColor: z.string().min(1, "Secondary color is required"),
  accentColor: z.string().min(1, "Accent color is required"),
  backgroundColor: z.string().min(1, "Background color is required"),
  textColor: z.string().min(1, "Text color is required"),
  surfaceColor: z.string().min(1, "Surface color is required"),
  borderColor: z.string().min(1, "Border color is required"),
  mutedColor: z.string().min(1, "Muted color is required"),
  headingColor: z.string().min(1, "Heading color is required"),
});

export const ApplyPresetSchema = z.object({
  presetName: z.string().min(1, "Preset name is required"),
});
