import { publicUser, requireUser } from './_lib/auth.js';
import { sendError, sendJson, readJson, requireMethod } from './_lib/http.js';
import { getStore } from './_lib/store.js';
import { defaultUserSettings } from './_lib/workspaceDefaults.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'PUT')) return;

  try {
    const store = await getStore();
    const user = await requireUser(req, store);
    if (!user) {
      sendError(res, 401, 'Not signed in.');
      return;
    }

    const { name = user.name, workspaceName, settings = {} } = await readJson(req);
    const displayName = name.trim();
    if (!displayName) {
      sendError(res, 400, 'Display name is required.');
      return;
    }

    const nextSettings = {
      ...defaultUserSettings,
      ...user.settings,
      ...settings,
      ...(workspaceName ? { workspaceName: workspaceName.trim() } : {})
    };
    const nextUser = await store.updateUser(user.id, {
      name: displayName,
      settings: nextSettings
    });
    const aiKeyConfigured = await store.hasOpenAiKey(user.id);
    await store.addActivity(user.id, 'profile', `${displayName} updated profile settings.`);

    sendJson(res, 200, {
      ok: true,
      user: publicUser({ ...nextUser, aiKeyConfigured })
    });
  } catch (error) {
    sendError(res, 500, 'Could not update profile.', error.message);
  }
}
