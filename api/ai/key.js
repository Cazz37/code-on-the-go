import { publicUser, requireUser } from '../_lib/auth.js';
import { sendError, sendJson, readJson } from '../_lib/http.js';
import { maskSecret, validateOpenAiKey } from '../_lib/secrets.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  try {
    const store = await getStore();
    const user = await requireUser(req, store);
    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    if (req.method === 'GET') {
      const key = await store.getOpenAiKey(user.id);
      sendJson(res, 200, {
        ok: true,
        configured: Boolean(key),
        masked: maskSecret(key),
        user: publicUser({ ...user, aiKeyConfigured: Boolean(key) })
      });
      return;
    }

    if (req.method === 'PUT') {
      const { apiKey = '' } = await readJson(req);
      const validation = validateOpenAiKey(apiKey);
      if (!validation.ok) {
        sendError(res, 400, validation.message);
        return;
      }

      await store.setOpenAiKey(user.id, validation.key);
      await store.addActivity(user.id, 'settings', `${user.name} connected a personal OpenAI API key.`);
      sendJson(res, 200, {
        ok: true,
        configured: true,
        masked: maskSecret(validation.key),
        user: publicUser({ ...user, aiKeyConfigured: true })
      });
      return;
    }

    if (req.method === 'DELETE') {
      await store.deleteOpenAiKey(user.id);
      await store.addActivity(user.id, 'settings', `${user.name} removed their personal OpenAI API key.`);
      sendJson(res, 200, {
        ok: true,
        configured: false,
        masked: null,
        user: publicUser({ ...user, aiKeyConfigured: false })
      });
      return;
    }

    sendError(res, 405, 'Use GET, PUT, or DELETE for this endpoint.');
  } catch (error) {
    sendError(res, 500, 'Could not update AI key settings.', error.message);
  }
}
