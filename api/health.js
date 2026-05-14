import { sendJson } from './_lib/http.js';
import { getStore } from './_lib/store.js';

export default async function handler(req, res) {
  const store = await getStore();
  sendJson(res, 200, {
    ok: true,
    database: store.persistent ? 'postgres' : 'local-dev-json',
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
    personalAiKeysSupported: true,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    payPointConfigured: Boolean(process.env.PAYPOINT_API_KEY)
  });
}
