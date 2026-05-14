import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

const cookieName = 'codego_session';

export function getJwtSecret() {
  return process.env.APP_JWT_SECRET || process.env.JWT_SECRET || 'dev-only-code-on-the-go-secret';
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
    { expiresIn: '14d' }
  );

  return serialize(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });
}

export function clearSessionCookie() {
  return serialize(cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
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
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export async function requireUser(req, store) {
  const session = readSession(req);
  if (!session?.sub) {
    return null;
  }

  return store.findUserById(session.sub);
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
    settings: user.settings,
    createdAt: user.createdAt
  };
}
