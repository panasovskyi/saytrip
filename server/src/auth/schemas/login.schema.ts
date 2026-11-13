import z from 'zod';

export const loginSchema = z
  .strictObject({
    email: z.email({ error: 'Enter a valid email address' }).toLowerCase(),
    password: z
      .string({ error: 'Password is required' })
      .min(1, 'Password is required')
  })
export type LoginPayload = z.infer<typeof loginSchema>;
