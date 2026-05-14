export const plans = {
  starter: {
    id: 'starter',
    name: 'Starter',
    amount: 0,
    stripePriceEnv: null
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    amount: 12,
    stripePriceEnv: 'STRIPE_PRICE_PRO'
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    amount: 24,
    stripePriceEnv: 'STRIPE_PRICE_STUDIO'
  }
};

export function getPlan(planId) {
  return plans[planId] ?? plans.starter;
}
