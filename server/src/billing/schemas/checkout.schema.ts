import z from 'zod';
import { Plan } from '../../generated/prisma/client';

export const checkoutSchema = z.strictObject({
  plan: z.enum(Plan, { error: 'Choose a paid plan' }).exclude(['FREE']),
});
export type CheckoutPayload = z.infer<typeof checkoutSchema>;
