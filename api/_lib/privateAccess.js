import bcrypt from 'bcryptjs';

const inviteSlots = [
  {
    id: 'caren',
    role: 'admin',
    label: 'Caren van Wyk',
    environmentKey: 'PRIVATE_CAREN_INVITE_HASH'
  },
  {
    id: 'ruan',
    role: 'admin',
    label: 'Ruan Thomas',
    environmentKey: 'PRIVATE_RUAN_INVITE_HASH'
  }
];

function getInviteHash(slot) {
  return process.env[slot.environmentKey] || '';
}

export async function matchPrivateInvite(inviteCode) {
  if (!isPrivateAccessConfigured()) {
    const error = new Error('Private access is not configured. Add both invitation hashes in Vercel, then redeploy.');
    error.code = 'MISSING_PRIVATE_ACCESS_CONFIG';
    throw error;
  }

  const code = String(inviteCode ?? '').trim();
  if (code.length < 20) {
    return null;
  }

  for (const slot of inviteSlots) {
    if (await bcrypt.compare(code, getInviteHash(slot))) {
      return {
        id: slot.id,
        role: slot.role,
        label: slot.label
      };
    }
  }

  return null;
}

export function hasPrivateAccess(user) {
  return Boolean(
    user &&
      user.accessRole === 'admin' &&
      ['caren', 'ruan'].includes(user.accessSlot)
  );
}

export function getPrivateAccessLimit() {
  return inviteSlots.length;
}

export function isPrivateAccessConfigured() {
  return inviteSlots.every((slot) => Boolean(getInviteHash(slot)));
}
