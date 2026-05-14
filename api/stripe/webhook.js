import Stripe from 'stripe';
import { sendError, sendJson, readRawBody, requireMethod } from '../_lib/http.js';
import { getPlan } from '../_lib/plans.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    sendError(res, 503, 'Stripe webhook is not configured.');
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    const store = await getStore();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const plan = getPlan(planId);

      if (userId && planId) {
        const user = await store.findUserById(userId);
        if (user) {
          await store.updateUser(userId, {
            planId,
            paymentProvider: 'Stripe',
            subscriptionStatus: 'active'
          });
          await store.recordPayment({
            id: `stripe-${session.id}`,
            userId,
            planId,
            provider: 'Stripe',
            status: 'paid',
            amount: plan.amount,
            externalId: session.id
          });
          await store.addActivity(userId, 'payment', `${user.name} completed Stripe checkout for ${plan.name}.`);
        }
      }
    }

    sendJson(res, 200, { ok: true, received: true });
  } catch (error) {
    sendError(res, 400, 'Stripe webhook verification failed.', error.message);
  }
}
