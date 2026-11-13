import { Plan, PlanDescription } from '@/features/subscription/subscription.types';

export const PLANS: Record<Plan, PlanDescription> = {
  FREE: {
    label: "Sonnet 5.5",
    effort: "Medium",
    price: 0,
    priceLabel: "Free",
    feature: "Default",
  },
  SONNET_HIGH: {
    label: "Sonnet 5.5",
    effort: "High",
    price: 1,
    priceLabel: "€1 / month",
    feature: "Thinks longer",
  },
  SONNET_XHIGH: {
    label: "Sonnet 5.5",
    effort: "Extra High",
    price: 2,
    priceLabel: "€2 / month",
    feature: "Thinks longest",
  },
  OPUS_MEDIUM: {
    label: "Opus 5.5",
    effort: "Medium",
    price: 3,
    priceLabel: "€3 / month",
    feature: "Larger model",
  },
  OPUS_HIGH: {
    label: "Opus 5.5",
    effort: "High",
    price: 4,
    priceLabel: "€4 / month",
    feature: "Largest model, thinks longer",
  },
  OPUS_XHIGH: {
    label: "Opus 5.5",
    effort: "Extra High",
    price: 5,
    priceLabel: "€5 / month",
    feature: "Maximum depth, slowest",
  },
};
