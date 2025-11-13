import { z } from 'zod';

export const signUpBody = z.object({
  username: z.string().email().min(3).max(30),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  password: z.string().min(6)
});

export const signInBody = z.object({
  username: z.string().email(),
  password: z.string().min(6)
});

export const updateBody = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  password: z.string().min(6).optional()
});