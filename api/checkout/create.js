import Stripe from 'stripe';
import { requireUser, publicUser } from '../_lib/auth.js';
import { getOrigin, sendError, sendJson, readJson, requireMethod } from '../_lib/http.js';
import { getPlan } from '../_lib/plans.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    const store = await getStore();
    const user = await requireUser(req, store);
    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    const { planId = 'starter', provider = 'Stripe', payment = {} } = await readJson(req);
    const plan = getPlan(planId);

    if (plan.amount === 0) {
      const nextUser = await store.updateUser(user.id, {
        planId: plan.id,
        paymentProvider: null,
        subscriptionStatus: 'active'
      });
      await store.addActivity(user.id, 'subscription', `${user.name} selected the Starter plan.`);
      sendJson(res, 200, { ok: true, mode: 'free', user: publicUser(nextUser) });
      return;
    }

    if (provider === 'PayPoint') {
      if (!process.env.PAYPOINT_API_KEY) {
        if (process.env.ALLOW_TEST_PAYMENTS === 'true' || process.env.NODE_ENV !== 'production') {
          const nextUser = await store.updateUser(user.id, {
            planId: plan.id,
            paymentProvider: 'PayPoint',
            subscriptionStatus: 'active'
          });
          await store.recordPayment({
            userId: user.id,
            planId: plan.id,
            provider: 'PayPoint',
            status: 'test_paid',
            amount: plan.amount,
            reference: payment.reference || 'PP-TEST'
          });
          await store.addActivity(user.id, 'subscription', `${user.name} activated ${plan.name} with PayPoint test checkout.`);
          sendJson(res, 200, { ok: true, mode: 'test_paid', user: publicUser(nextUser) });
          return;
        }

        sendError(res, 503, 'PayPoint is not configured. Add PayPoint credentials before production checkout.');
        return;
      }

      sendError(res, 501, 'PayPoint live checkout needs the exact PayPoint product/API account details before implementation.');
      return;
    }

    if (provider !== 'Stripe') {
      sendError(res, 400, 'Unsupported payment provider.');
      return;
    }

    const priceId = process.env[plan.stripePriceEnv];
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      if (process.env.ALLOW_TEST_PAYMENTS === 'true' || process.env.NODE_ENV !== 'production') {
        const digits = String(payment.cardNumber ?? '').replace(/\D/g, '');
        const nextUser = await store.updateUser(user.id, {
          planId: plan.id,
          paymentProvider: 'Stripe',
          subscriptionStatus: 'active'
        });
        await store.recordPayment({
          userId: user.id,
          planId: plan.id,
          provider: 'Stripe',
          status: 'test_paid',
          amount: plan.amount,
          last4: digits.slice(-4)
        });
        await store.addActivity(user.id, 'subscription', `${user.name} activated ${plan.name} with Stripe test checkout.`);
        sendJson(res, 200, { ok: true, mode: 'test_paid', user: publicUser(nextUser) });
        return;
      }

      sendError(res, 503, 'Stripe is not configured. Add STRIPE_SECRET_KEY and Stripe price IDs.');
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = process.env.APP_BASE_URL || getOrigin(req);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        userId: user.id,
        planId: plan.id
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: plan.id
        }
      }
    });

    await store.recordPayment({
      userId: user.id,
      planId: plan.id,
      provider: 'Stripe',
      status: 'checkout_created',
      amount: plan.amount,
      externalId: session.id
    });

    sendJson(res, 200, {
      ok: true,
      mode: 'stripe_checkout',
      checkoutUrl: session.url
    });
  } catch (error) {
    sendError(res, 500, 'Could not start checkout.', error.message);
  }
}
