import {z} from 'zod'


export const adminRegisterSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email format'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number too long'),
    industry: z.string().min(1, 'Industry is required'),
    businessRegNo: z
      .string()
      .min(1, 'Business registration number is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipcode: z.string().min(4, 'Zip code is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;


export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
