import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;