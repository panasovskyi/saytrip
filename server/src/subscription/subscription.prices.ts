import { Plan } from '../generated/prisma/client';

export type PaidPlan = Exclude<Plan, 'FREE'>;

export const STRIPE_PRICE_IDS: Record<PaidPlan, string> = {
  SONNET_HIGH: 'price_1UZcnQRr98fBgxCOOYnFDD3E',
  SONNET_XHIGH: 'price_1UZcntRr98fBgxCOymQt9Y2G',
  OPUS_MEDIUM: 'price_1UZcoLRr98fBgxCOSc3Opcoe',
  OPUS_HIGH: 'price_1UZcoqRr98fBgxCOEPLo2fhj',
  OPUS_XHIGH: 'price_1UZcpGRr98fBgxCOlHFnvAHV',
};

export function planFromPriceId(priceId: string): PaidPlan | null {
  const entries = Object.entries(STRIPE_PRICE_IDS) as [PaidPlan, string][];
  const found = entries.find(([, id]) => id === priceId);

  return found ? found[0] : null;
}
