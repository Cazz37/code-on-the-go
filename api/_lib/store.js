import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';
import { encryptSecret, decryptSecret } from './secrets.js';
import { defaultUserSettings, createInitialWorkspace } from './workspaceDefaults.js';

const { Pool } = pg;
const defaultDbPath = path.join(process.cwd(), '.data', 'codego-backend.json');

let pool;
let schemaReady = false;

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function now() {
  return new Date().toISOString();
}

function getLocalDbPath() {
  return process.env.LOCAL_DB_PATH || defaultDbPath;
}

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''
  );
}

function getDatabaseSsl(databaseUrl) {
  const normalizedUrl = databaseUrl.toLowerCase();
  return normalizedUrl.includes('localhost') || normalizedUrl.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false };
}

function isPostgresEnabled() {
  return Boolean(getDatabaseUrl());
}

function needsPersistentDatabase() {
  return process.env.VERCEL === '1' || process.env.VERCEL_ENV === 'production';
}

export function isMissingProductionDatabase() {
  return needsPersistentDatabase() && !isPostgresEnabled();
}

export function createMissingDatabaseError() {
  const error = new Error('Production database is not configured. Add DATABASE_URL or POSTGRES_URL in Vercel, then redeploy.');
  error.code = 'MISSING_DATABASE';
  return error;
}

export function getDatabaseMode() {
  if (isPostgresEnabled()) {
    return 'postgres';
  }

  return needsPersistentDatabase() ? 'missing' : 'local-dev-json';
}

async function getPool() {
  const databaseUrl = getDatabaseUrl();
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: getDatabaseSsl(databaseUrl)
    });
  }

  if (!schemaReady) {
    await ensurePostgresSchema();
    schemaReady = true;
  }

  return pool;
}

async function ensurePostgresSchema() {
  const databaseUrl = getDatabaseUrl();
  const client = pool ?? new Pool({
    connectionString: databaseUrl,
    ssl: getDatabaseSsl(databaseUrl)
  });
  pool = client;

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan_id TEXT NOT NULL DEFAULT 'starter',
      payment_provider TEXT,
      subscription_status TEXT NOT NULL DEFAULT 'inactive',
      access_role TEXT,
      access_slot TEXT,
      session_version INTEGER NOT NULL DEFAULT 0,
      settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS access_role TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS access_slot TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
    CREATE UNIQUE INDEX IF NOT EXISTS users_access_slot_unique
      ON users(access_slot)
      WHERE access_slot IS NOT NULL;

    CREATE TABLE IF NOT EXISTS workspaces (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      plan_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      status TEXT NOT NULL,
      amount INTEGER NOT NULL,
      external_id TEXT,
      reference TEXT,
      last4 TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_secrets (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      openai_api_key_cipher TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

}

async function loadFileState() {
  try {
    const raw = await fs.readFile(getLocalDbPath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    const initial = {
      users: [],
      workspaces: {},
      payments: [],
      secrets: {},
      activity: []
    };
    await saveFileState(initial);
    return initial;
  }
}

async function saveFileState(state) {
  const dbPath = getLocalDbPath();
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(state, null, 2));
}

function mapPgUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    planId: row.plan_id,
    paymentProvider: row.payment_provider,
    subscriptionStatus: row.subscription_status,
    accessRole: row.access_role,
    accessSlot: row.access_slot,
    sessionVersion: row.session_version ?? 0,
    settings: {
      ...defaultUserSettings,
      ...(row.settings ?? {})
    },
    createdAt: row.created_at
  };
}

function mapFileUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    sessionVersion: user.sessionVersion ?? 0,
    settings: {
      ...defaultUserSettings,
      ...(user.settings ?? {})
    }
  };
}

export async function getStore() {
  if (isPostgresEnabled()) {
    const db = await getPool();
    return createPostgresStore(db);
  }

  if (needsPersistentDatabase()) {
    throw createMissingDatabaseError();
  }

  return createFileStore();
}

function createPostgresStore(db) {
  return {
    persistent: true,
    async findUserByEmail(email) {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return mapPgUser(result.rows[0]);
    },
    async findUserById(id) {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return mapPgUser(result.rows[0]);
    },
    async findUserByAccessSlot(accessSlot) {
      const result = await db.query('SELECT * FROM users WHERE access_slot = $1', [accessSlot]);
      return mapPgUser(result.rows[0]);
    },
    async createUser({
      name,
      email,
      passwordHash,
      planId = 'starter',
      accessRole = null,
      accessSlot = null
    }) {
      const user = {
        id: createId('user'),
        name,
        email,
        passwordHash,
        planId,
        paymentProvider: null,
        subscriptionStatus: accessRole ? 'private' : planId === 'starter' ? 'active' : 'pending',
        accessRole,
        accessSlot,
        sessionVersion: 0,
        settings: defaultUserSettings,
        createdAt: now()
      };
      await db.query(
        `INSERT INTO users
          (id, name, email, password_hash, plan_id, subscription_status, access_role, access_slot, settings, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash,
          user.planId,
          user.subscriptionStatus,
          user.accessRole,
          user.accessSlot,
          JSON.stringify(user.settings),
          user.createdAt
        ]
      );
      await db.query('INSERT INTO workspaces (user_id, data, updated_at) VALUES ($1, $2, $3)', [
        user.id,
        JSON.stringify(createInitialWorkspace()),
        user.createdAt
      ]);
      return user;
    },
    async updateUser(id, patch) {
      const current = await this.findUserById(id);
      const next = {
        ...current,
        ...patch,
        settings: {
          ...defaultUserSettings,
          ...(patch.settings ?? current.settings ?? {})
        }
      };
      await db.query(
        `UPDATE users
         SET name = $2, plan_id = $3, payment_provider = $4, subscription_status = $5,
             settings = $6, access_role = $7, access_slot = $8
         WHERE id = $1`,
        [
          id,
          next.name,
          next.planId,
          next.paymentProvider,
          next.subscriptionStatus,
          JSON.stringify(next.settings),
          next.accessRole ?? null,
          next.accessSlot ?? null
        ]
      );
      return next;
    },
    async updatePassword(id, passwordHash) {
      const result = await db.query(
        `UPDATE users
         SET password_hash = $2, session_version = session_version + 1
         WHERE id = $1
         RETURNING *`,
        [id, passwordHash]
      );
      return mapPgUser(result.rows[0]);
    },
    async getWorkspace(userId) {
      const result = await db.query('SELECT data FROM workspaces WHERE user_id = $1', [userId]);
      if (result.rows[0]?.data) {
        return result.rows[0].data;
      }
      const workspace = createInitialWorkspace();
      await this.saveWorkspace(userId, workspace);
      return workspace;
    },
    async saveWorkspace(userId, workspace) {
      await db.query(
        `INSERT INTO workspaces (user_id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [userId, JSON.stringify(workspace)]
      );
      return workspace;
    },
    async addActivity(userId, type, message) {
      const item = { id: createId('activity'), userId, type, message, createdAt: now() };
      await db.query(
        'INSERT INTO activity (id, user_id, type, message, created_at) VALUES ($1, $2, $3, $4, $5)',
        [item.id, userId, type, message, item.createdAt]
      );
      return item;
    },
    async listActivity(userId) {
      const result = await db.query(
        'SELECT id, user_id, type, message, created_at FROM activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
        [userId]
      );
      return result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        message: row.message,
        createdAt: row.created_at
      }));
    },
    async recordPayment(payment) {
      const item = {
        id: payment.id ?? createId('payment'),
        createdAt: payment.createdAt ?? now(),
        ...payment
      };
      await db.query(
        `INSERT INTO payments (id, user_id, plan_id, provider, status, amount, external_id, reference, last4, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
        [
          item.id,
          item.userId,
          item.planId,
          item.provider,
          item.status,
          item.amount,
          item.externalId,
          item.reference,
          item.last4,
          item.createdAt
        ]
      );
      return item;
    },
    async hasOpenAiKey(userId) {
      const result = await db.query(
        'SELECT openai_api_key_cipher FROM user_secrets WHERE user_id = $1',
        [userId]
      );
      return Boolean(result.rows[0]?.openai_api_key_cipher);
    },
    async getOpenAiKey(userId) {
      const result = await db.query(
        'SELECT openai_api_key_cipher FROM user_secrets WHERE user_id = $1',
        [userId]
      );
      return decryptSecret(result.rows[0]?.openai_api_key_cipher);
    },
    async setOpenAiKey(userId, key) {
      const encrypted = encryptSecret(key);
      await db.query(
        `INSERT INTO user_secrets (user_id, openai_api_key_cipher, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET openai_api_key_cipher = EXCLUDED.openai_api_key_cipher, updated_at = NOW()`,
        [userId, encrypted]
      );
      return true;
    },
    async deleteOpenAiKey(userId) {
      await db.query(
        `INSERT INTO user_secrets (user_id, openai_api_key_cipher, updated_at)
         VALUES ($1, NULL, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET openai_api_key_cipher = NULL, updated_at = NOW()`,
        [userId]
      );
      return true;
    }
  };
}

function createFileStore() {
  return {
    persistent: false,
    async findUserByEmail(email) {
      const state = await loadFileState();
      return mapFileUser(state.users.find((user) => user.email === email));
    },
    async findUserById(id) {
      const state = await loadFileState();
      return mapFileUser(state.users.find((user) => user.id === id));
    },
    async findUserByAccessSlot(accessSlot) {
      const state = await loadFileState();
      return mapFileUser(state.users.find((user) => user.accessSlot === accessSlot));
    },
    async createUser({
      name,
      email,
      passwordHash,
      planId = 'starter',
      accessRole = null,
      accessSlot = null
    }) {
      const state = await loadFileState();
      if (
        state.users.some(
          (user) => user.email === email || (accessSlot && user.accessSlot === accessSlot)
        )
      ) {
        const error = new Error('Email or access slot already exists.');
        error.code = '23505';
        throw error;
      }
      const user = {
        id: createId('user'),
        name,
        email,
        passwordHash,
        planId,
        paymentProvider: null,
        subscriptionStatus: accessRole ? 'private' : planId === 'starter' ? 'active' : 'pending',
        accessRole,
        accessSlot,
        sessionVersion: 0,
        settings: defaultUserSettings,
        createdAt: now()
      };
      state.users.push(user);
      state.workspaces[user.id] = createInitialWorkspace();
      await saveFileState(state);
      return user;
    },
    async updateUser(id, patch) {
      const state = await loadFileState();
      const index = state.users.findIndex((user) => user.id === id);
      state.users[index] = {
        ...state.users[index],
        ...patch,
        settings: {
          ...defaultUserSettings,
          ...(patch.settings ?? state.users[index].settings ?? {})
        }
      };
      await saveFileState(state);
      return mapFileUser(state.users[index]);
    },
    async updatePassword(id, passwordHash) {
      const state = await loadFileState();
      const index = state.users.findIndex((user) => user.id === id);
      if (index < 0) {
        return null;
      }
      state.users[index] = {
        ...state.users[index],
        passwordHash,
        sessionVersion: (state.users[index].sessionVersion ?? 0) + 1
      };
      await saveFileState(state);
      return mapFileUser(state.users[index]);
    },
    async getWorkspace(userId) {
      const state = await loadFileState();
      state.workspaces[userId] ??= createInitialWorkspace();
      await saveFileState(state);
      return state.workspaces[userId];
    },
    async saveWorkspace(userId, workspace) {
      const state = await loadFileState();
      state.workspaces[userId] = workspace;
      await saveFileState(state);
      return workspace;
    },
    async addActivity(userId, type, message) {
      const state = await loadFileState();
      const item = { id: createId('activity'), userId, type, message, createdAt: now() };
      state.activity.unshift(item);
      state.activity = state.activity.slice(0, 30);
      await saveFileState(state);
      return item;
    },
    async listActivity(userId) {
      const state = await loadFileState();
      return state.activity.filter((item) => item.userId === userId).slice(0, 30);
    },
    async recordPayment(payment) {
      const state = await loadFileState();
      const item = {
        id: payment.id ?? createId('payment'),
        createdAt: payment.createdAt ?? now(),
        ...payment
      };
      state.payments.unshift(item);
      await saveFileState(state);
      return item;
    },
    async hasOpenAiKey(userId) {
      const state = await loadFileState();
      return Boolean(state.secrets?.[userId]?.openaiApiKeyCipher);
    },
    async getOpenAiKey(userId) {
      const state = await loadFileState();
      return decryptSecret(state.secrets?.[userId]?.openaiApiKeyCipher);
    },
    async setOpenAiKey(userId, key) {
      const state = await loadFileState();
      state.secrets ??= {};
      state.secrets[userId] = {
        ...(state.secrets[userId] ?? {}),
        openaiApiKeyCipher: encryptSecret(key),
        updatedAt: now()
      };
      await saveFileState(state);
      return true;
    },
    async deleteOpenAiKey(userId) {
      const state = await loadFileState();
      state.secrets ??= {};
      state.secrets[userId] = {
        ...(state.secrets[userId] ?? {}),
        openaiApiKeyCipher: null,
        updatedAt: now()
      };
      await saveFileState(state);
      return true;
    }
  };
}
