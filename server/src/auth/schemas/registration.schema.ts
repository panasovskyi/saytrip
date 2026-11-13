import z from 'zod';

export const registrationSchema = z
  .strictObject({
    name: z
      .string({ error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .max(20, 'Name must be at most 20 characters'),
    email: z.email({ error: 'Enter a valid email address' }).toLowerCase(),
    password: z
      .string({ error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a digit')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
    passwordConfirmation: z
      .string({ error: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
    isAgreed: z.literal(true, {
      error: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match',
  })
  .transform(({ name, email, password }) => ({
    name,
    email,
    password,
    termsAcceptedAt: new Date(),
  }));

export type RegistrationPayload = z.infer<typeof registrationSchema>;
