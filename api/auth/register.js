import { createSessionCookie, hashPassword, publicUser } from '../_lib/auth.js';
import { sendError, sendJson, readJson, requireMethod } from '../_lib/http.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    const { name = '', email = '', password = '', planId = 'starter' } = await readJson(req);
    const displayName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!displayName || !normalizedEmail || password.length < 6) {
      sendError(res, 400, 'Name, email, and a password of at least 6 characters are required.');
      return;
    }

    const store = await getStore();
    const existing = await store.findUserByEmail(normalizedEmail);
    if (existing) {
      sendError(res, 409, 'An account with this email already exists.');
      return;
    }

    const user = await store.createUser({
      name: displayName,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      planId
    });
    await store.addActivity(user.id, 'signup', `${displayName} created an account.`);
    const workspace = await store.getWorkspace(user.id);
    const activity = await store.listActivity(user.id);

    sendJson(
      res,
      201,
      {
        ok: true,
        user: publicUser({ ...user, aiKeyConfigured: false }),
        workspace,
        activity
      },
      { 'Set-Cookie': createSessionCookie(user) }
    );
  } catch (error) {
    if (error.code === 'MISSING_DATABASE') {
      sendError(res, 503, error.message);
      return;
    }

    sendError(res, 500, 'Could not register account.', error.message);
  }
}
