import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';
import { hasPrivateAccess } from './privateAccess.js';

const cookieName = 'codego_session';

export function getJwtSecret() {
  const configuredSecret = process.env.APP_JWT_SECRET || process.env.JWT_SECRET;
  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    const error = new Error('APP_JWT_SECRET is required for private production access.');
    error.code = 'MISSING_JWT_SECRET';
    throw error;
  }

  return 'dev-only-code-on-the-go-secret';
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionCookie(user) {
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    getJwtSecret(),
    {
      expiresIn: '14d',
      algorithm: 'HS256',
      issuer: 'code-on-the-go',
      audience: 'private-workspace'
    }
  );

  return serialize(cookieName, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });
}

export function clearSessionCookie() {
  return serialize(cookieName, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export function readSession(req) {
  const cookies = parse(req.headers.cookie ?? '');
  const token = cookies[cookieName];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: 'code-on-the-go',
      audience: 'private-workspace'
    });
  } catch {
    return null;
  }
}

export async function requireUser(req, store) {
  const session = readSession(req);
  if (!session?.sub) {
    return null;
  }

  const user = await store.findUserById(session.sub);
  return hasPrivateAccess(user) ? user : null;
}

export function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    planId: user.planId,
    paymentProvider: user.paymentProvider,
    subscriptionStatus: user.subscriptionStatus,
    accessRole: user.accessRole,
    settings: user.settings,
    createdAt: user.createdAt,
    ...(typeof user.aiKeyConfigured === 'boolean'
      ? { aiKeyConfigured: user.aiKeyConfigured }
      : {})
  };
}
