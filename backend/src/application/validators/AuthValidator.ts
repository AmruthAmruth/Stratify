import { z } from "zod";

export const VerifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4, "OTP must be at least 4 characters"),
});

export const ResendOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const VerifyForgotPasswordOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4, "OTP must be at least 4 characters"),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
