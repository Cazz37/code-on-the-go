import { publicUser, requireUser } from './_lib/auth.js';
import { sendError, sendJson } from './_lib/http.js';
import { getStore } from './_lib/store.js';

export default async function handler(req, res) {
  try {
    const store = await getStore();
    const user = await requireUser(req, store);

    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    const workspace = await store.getWorkspace(user.id);
    const activity = await store.listActivity(user.id);

    sendJson(res, 200, {
      ok: true,
      user: publicUser(user),
      workspace,
      activity,
      database: store.persistent ? 'postgres' : 'local-dev-json'
    });
  } catch (error) {
    sendError(res, 500, 'Could not load current user.', error.message);
  }
}
