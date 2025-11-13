import { z } from 'zod';

export const transferBody = z.object({
  toUsername: z.string().email(),
  amount: z.number().min(1)
});