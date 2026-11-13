export type Subscription = {
  id: string;
  plan: Plan;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Plan =
  | "FREE"
  | "SONNET_HIGH"
  | "SONNET_XHIGH"
  | "OPUS_MEDIUM"
  | "OPUS_HIGH"
  | "OPUS_XHIGH";


export type PlanDescription = {
  label: string;
  effort: string;
  price: number;
  priceLabel: string;
  feature: string;
}