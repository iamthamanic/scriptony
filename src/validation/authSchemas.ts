
import { z } from "zod";
import { basicTextSchema } from "./index";

// Login form validation
export const loginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein.")
});

// Registration form validation
export const registerSchema = z.object({
  name: z.string().min(2, "Der Name muss mindestens 2 Zeichen lang sein."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein.")
});

// Password reset form validation
export const passwordResetSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein.")
});

// Type inference helpers
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
