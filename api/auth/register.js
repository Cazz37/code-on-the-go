import { createSessionCookie, hashPassword, publicUser, verifyPassword } from '../_lib/auth.js';
import { sendError, sendJson, readJson, requireMethod } from '../_lib/http.js';
import { matchPrivateInvite } from '../_lib/privateAccess.js';
import { getStore } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    const { email = '', password = '', inviteCode = '' } = await readJson(req);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || password.length < 12 || !inviteCode.trim()) {
      sendError(res, 400, 'Invite code, email, and a password of at least 12 characters are required.');
      return;
    }

    const invite = await matchPrivateInvite(inviteCode);
    if (!invite) {
      sendError(res, 403, 'That private invitation code is not valid.');
      return;
    }

    const displayName = invite.label;

    const store = await getStore();
    const claimedUser = await store.findUserByAccessSlot(invite.id);
    if (claimedUser) {
      sendError(res, 409, 'That private invitation has already been activated. Sign in instead.');
      return;
    }

    const existing = await store.findUserByEmail(normalizedEmail);
    if (existing) {
      if (!(await verifyPassword(password, existing.passwordHash))) {
        sendError(res, 409, 'That email already exists. Enter its existing password to activate private access.');
        return;
      }

      const user = await store.updateUser(existing.id, {
        name: displayName,
        accessRole: invite.role,
        accessSlot: invite.id,
        subscriptionStatus: 'private'
      });
      await store.addActivity(user.id, 'access-activated', `${displayName} activated ${invite.label} access.`);
      const workspace = await store.getWorkspace(user.id);
      const activity = await store.listActivity(user.id);

      sendJson(
        res,
        200,
        { ok: true, user: publicUser({ ...user, aiKeyConfigured: await store.hasOpenAiKey(user.id) }), workspace, activity },
        { 'Set-Cookie': createSessionCookie(user) }
      );
      return;
    }

    const user = await store.createUser({
      name: displayName,
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      planId: 'starter',
      accessRole: invite.role,
      accessSlot: invite.id
    });
    await store.addActivity(user.id, 'access-activated', `${displayName} activated ${invite.label} access.`);
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
    if (error.code === '23505') {
      sendError(res, 409, 'That private invitation or email has already been activated.');
      return;
    }

    if (
      error.code === 'MISSING_DATABASE' ||
      error.code === 'MISSING_JWT_SECRET' ||
      error.code === 'MISSING_PRIVATE_ACCESS_CONFIG'
    ) {
      sendError(res, 503, error.message);
      return;
    }

    sendError(res, 500, 'Could not register account.', error.message);
  }
}
