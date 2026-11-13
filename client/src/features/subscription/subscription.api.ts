import { Plan } from '@/features/subscription/subscription.types'
import { api } from '@/lib/api'

export const subscriptionApi = {
  async createCheckout(plan: Exclude<Plan, "FREE">): Promise<string> {
    const res = await api.post<{url: string}>("/billing/checkout", { plan });

    return res.url;
  }
}