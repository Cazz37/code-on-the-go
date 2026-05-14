import { requireUser } from './_lib/auth.js';
import { sendError, sendJson, readJson } from './_lib/http.js';
import { getStore } from './_lib/store.js';

export default async function handler(req, res) {
  try {
    const store = await getStore();
    const user = await requireUser(req, store);
    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    if (req.method === 'GET') {
      const workspace = await store.getWorkspace(user.id);
      sendJson(res, 200, { ok: true, workspace });
      return;
    }

    if (req.method === 'PUT') {
      const { workspace } = await readJson(req);
      if (!workspace || typeof workspace !== 'object') {
        sendError(res, 400, 'Workspace payload is required.');
        return;
      }

      const saved = await store.saveWorkspace(user.id, workspace);
      await store.addActivity(user.id, 'workspace', `${user.name} saved workspace files.`);
      sendJson(res, 200, { ok: true, workspace: saved });
      return;
    }

    sendError(res, 405, 'Use GET or PUT for this endpoint.');
  } catch (error) {
    sendError(res, 500, 'Could not sync workspace.', error.message);
  }
}
