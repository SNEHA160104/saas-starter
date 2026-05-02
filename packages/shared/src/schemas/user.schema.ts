import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  googleId: z.string().optional(),
  isVerified: z.boolean().default(false),
  stripeCustomerId: z.string().optional(),
  currentTeamId: z.string().optional(),
  refreshTokenHash: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
