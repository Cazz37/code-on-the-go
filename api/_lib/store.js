import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { encryptSecret, decryptSecret } from './secrets.js';
import { defaultUserSettings, createInitialWorkspace } from './workspaceDefaults.js';

const { Pool } = pg;
const dbPath = process.env.LOCAL_DB_PATH || path.join(process.cwd(), '.data', 'codego-backend.json');

let pool;
let schemaReady = false;

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function now() {
  return new Date().toISOString();
}

function isPostgresEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  if (!schemaReady) {
    await ensurePostgresSchema();
    schemaReady = true;
  }

  return pool;
}

async function ensurePostgresSchema() {
  const client = pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
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
      settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

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

  const demo = await client.query('SELECT id FROM users WHERE email = $1', ['demo@codego.app']);
  if (demo.rowCount === 0) {
    const createdAt = now();
    const passwordHash = await bcrypt.hash('demo123', 12);
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, plan_id, payment_provider, subscription_status, settings, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        'user-demo',
        'Demo Builder',
        'demo@codego.app',
        passwordHash,
        'pro',
        'Stripe',
        'active',
        JSON.stringify(defaultUserSettings),
        createdAt
      ]
    );
    await client.query(
      'INSERT INTO workspaces (user_id, data, updated_at) VALUES ($1, $2, $3)',
      ['user-demo', JSON.stringify(createInitialWorkspace()), createdAt]
    );
    await client.query(
      'INSERT INTO activity (id, user_id, type, message, created_at) VALUES ($1, $2, $3, $4, $5)',
      ['activity-demo', 'user-demo', 'signup', 'Demo Builder signed up for Pro with Stripe checkout.', createdAt]
    );
  }
}

async function loadFileState() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    const createdAt = now();
    const passwordHash = await bcrypt.hash('demo123', 12);
    const initial = {
      users: [
        {
          id: 'user-demo',
          name: 'Demo Builder',
          email: 'demo@codego.app',
          passwordHash,
          planId: 'pro',
          paymentProvider: 'Stripe',
          subscriptionStatus: 'active',
          settings: defaultUserSettings,
          createdAt
        }
      ],
      workspaces: {
        'user-demo': createInitialWorkspace()
      },
      payments: [],
      secrets: {},
      activity: [
        {
          id: 'activity-demo',
          userId: 'user-demo',
          type: 'signup',
          message: 'Demo Builder signed up for Pro with Stripe checkout.',
          createdAt
        }
      ]
    };
    await saveFileState(initial);
    return initial;
  }
}

async function saveFileState(state) {
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
    async createUser({ name, email, passwordHash, planId = 'starter' }) {
      const user = {
        id: createId('user'),
        name,
        email,
        passwordHash,
        planId,
        paymentProvider: null,
        subscriptionStatus: planId === 'starter' ? 'active' : 'pending',
        settings: defaultUserSettings,
        createdAt: now()
      };
      await db.query(
        `INSERT INTO users (id, name, email, password_hash, plan_id, subscription_status, settings, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash,
          user.planId,
          user.subscriptionStatus,
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
         SET name = $2, plan_id = $3, payment_provider = $4, subscription_status = $5, settings = $6
         WHERE id = $1`,
        [
          id,
          next.name,
          next.planId,
          next.paymentProvider,
          next.subscriptionStatus,
          JSON.stringify(next.settings)
        ]
      );
      return next;
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
    async createUser({ name, email, passwordHash, planId = 'starter' }) {
      const state = await loadFileState();
      const user = {
        id: createId('user'),
        name,
        email,
        passwordHash,
        planId,
        paymentProvider: null,
        subscriptionStatus: planId === 'starter' ? 'active' : 'pending',
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
