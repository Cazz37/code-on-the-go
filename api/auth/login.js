import { createSessionCookie, publicUser, verifyPassword } from '../_lib/auth.js';
import { sendError, sendJson, readJson, requireMethod } from '../_lib/http.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    const { email = '', password = '' } = await readJson(req);
    const normalizedEmail = email.trim().toLowerCase();
    const store = await getStore();
    const user = await store.findUserByEmail(normalizedEmail);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      sendError(res, 401, 'Invalid email or password.');
      return;
    }

    const workspace = await store.getWorkspace(user.id);
    const activity = await store.listActivity(user.id);
    await store.addActivity(user.id, 'login', `${user.name} signed in.`);

    sendJson(
      res,
      200,
      {
        ok: true,
        user: publicUser(user),
        workspace,
        activity
      },
      { 'Set-Cookie': createSessionCookie(user) }
    );
  } catch (error) {
    sendError(res, 500, 'Could not sign in.', error.message);
  }
}
