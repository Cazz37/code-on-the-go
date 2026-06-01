import { sendJson } from './_lib/http.js';
import { getDatabaseMode, getStore, isMissingProductionDatabase } from './_lib/store.js';

export default async function handler(req, res) {
  if (isMissingProductionDatabase()) {
    sendJson(res, 503, {
      ok: false,
      database: getDatabaseMode(),
      error: 'Production database is not configured. Add DATABASE_URL or POSTGRES_URL in Vercel, then redeploy.',
      aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      personalAiKeysSupported: true,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      payPointConfigured: Boolean(process.env.PAYPOINT_API_KEY)
    });
    return;
  }

  const store = await getStore();
  sendJson(res, 200, {
    ok: true,
    database: store.persistent ? 'postgres' : getDatabaseMode(),
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    personalAiKeysSupported: true,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    payPointConfigured: Boolean(process.env.PAYPOINT_API_KEY)
  });
}
