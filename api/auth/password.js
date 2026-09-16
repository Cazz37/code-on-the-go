import { createSessionCookie, hashPassword, publicUser, requireUser, verifyPassword } from '../_lib/auth.js';
import { sendError, sendJson, readJson } from '../_lib/http.js';
import { hasPrivateAccess, matchPrivateInvite } from '../_lib/privateAccess.js';
import { getStore } from '../_lib/store.js';

async function changePassword(req, res) {
  const store = await getStore();
  const user = await requireUser(req, store);
  if (!user) {
    sendError(res, 401, 'Not signed in.');
    return;
  }

  const { currentPassword = '', newPassword = '' } = await readJson(req);
  if (!currentPassword || newPassword.length < 12) {
    sendError(res, 400, 'Enter your current password and a new password of at least 12 characters.');
    return;
  }

  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    sendError(res, 401, 'The current password is not correct.');
    return;
  }

  if (currentPassword === newPassword) {
    sendError(res, 400, 'Choose a new password that is different from the current one.');
    return;
  }

  const updatedUser = await store.updatePassword(user.id, await hashPassword(newPassword));
  await store.addActivity(user.id, 'password-changed', `${user.name} changed the account password.`);

  sendJson(
    res,
    200,
    { ok: true, message: 'Password changed successfully.' },
    { 'Set-Cookie': createSessionCookie(updatedUser) }
  );
}

async function recoverPassword(req, res) {
  const { email = '', recoveryCode = '', newPassword = '' } = await readJson(req);
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !recoveryCode.trim() || newPassword.length < 12) {
    sendError(res, 400, 'Email, private recovery code, and a new password of at least 12 characters are required.');
    return;
  }

  const invite = await matchPrivateInvite(recoveryCode);
  const store = await getStore();
  const user = await store.findUserByEmail(normalizedEmail);
  const claimedUser = invite ? await store.findUserByAccessSlot(invite.id) : null;

  if (
    !invite ||
    !user ||
    (claimedUser && claimedUser.id !== user.id) ||
    (user.accessSlot && user.accessSlot !== invite.id)
  ) {
    sendError(res, 403, 'Those recovery details do not match an approved private account.');
    return;
  }

  let recoveryUser = user;
  if (!hasPrivateAccess(user) || user.accessSlot !== invite.id) {
    recoveryUser = await store.updateUser(user.id, {
      name: invite.label,
      accessRole: invite.role,
      accessSlot: invite.id,
      subscriptionStatus: 'private'
    });
    await store.addActivity(user.id, 'access-activated', `${invite.label} activated private access during recovery.`);
  }

  const updatedUser = await store.updatePassword(recoveryUser.id, await hashPassword(newPassword));
  await store.addActivity(recoveryUser.id, 'password-recovered', `${recoveryUser.name} securely reset the account password.`);
  const workspace = await store.getWorkspace(recoveryUser.id);
  const activity = await store.listActivity(recoveryUser.id);
  const aiKeyConfigured = await store.hasOpenAiKey(recoveryUser.id);

  sendJson(
    res,
    200,
    {
      ok: true,
      message: 'Password reset successfully.',
      user: publicUser({ ...updatedUser, aiKeyConfigured }),
      workspace,
      activity
    },
    { 'Set-Cookie': createSessionCookie(updatedUser) }
  );
}

export default async function handler(req, res) {
  try {
    if (req.method === 'PUT') {
      await changePassword(req, res);
      return;
    }

    if (req.method === 'POST') {
      await recoverPassword(req, res);
      return;
    }

    sendError(res, 405, 'Use POST to recover a password or PUT to change it.');
  } catch (error) {
    if (error.code === 'MISSING_DATABASE' || error.code === 'MISSING_JWT_SECRET') {
      sendError(res, 503, error.message);
      return;
    }

    if (error.code === 'MISSING_PRIVATE_ACCESS_CONFIG') {
      sendError(res, 503, error.message);
      return;
    }

    sendError(res, 500, 'Could not update the password.', error.message);
  }
}
