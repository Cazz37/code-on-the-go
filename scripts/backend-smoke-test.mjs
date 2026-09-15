import { Readable } from 'node:stream';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

import { hashPassword } from '../api/_lib/auth.js';
import { getStore } from '../api/_lib/store.js';
import health from '../api/health.js';
import register from '../api/auth/register.js';
import login from '../api/auth/login.js';
import me from '../api/me.js';
import profile from '../api/profile.js';
import workspace from '../api/workspace.js';
import aiGenerate from '../api/ai/generate.js';
import aiKey from '../api/ai/key.js';
import checkoutCreate from '../api/checkout/create.js';

process.env.APP_JWT_SECRET = crypto.randomBytes(32).toString('hex');
process.env.APP_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
process.env.ALLOW_TEST_AI = 'true';
process.env.ALLOW_TEST_PAYMENTS = 'true';
process.env.LOCAL_DB_PATH = path.join(process.cwd(), '.data', `backend-smoke-${Date.now()}.json`);
const ownerInvite = `test-caren-${crypto.randomBytes(24).toString('base64url')}`;
const collaboratorInvite = `test-ruan-${crypto.randomBytes(24).toString('base64url')}`;
process.env.PRIVATE_CAREN_INVITE_HASH = bcrypt.hashSync(ownerInvite, 4);
process.env.PRIVATE_RUAN_INVITE_HASH = bcrypt.hashSync(collaboratorInvite, 4);

await fs.rm(process.env.LOCAL_DB_PATH, { force: true });

function createReq(method, body, headers = {}) {
  const req = Readable.from(body ? [JSON.stringify(body)] : []);
  req.method = method;
  req.headers = headers;
  return req;
}

function createRes() {
  const headers = {};
  return {
    statusCode: 200,
    headers,
    body: '',
    setHeader(key, value) {
      headers[key.toLowerCase()] = value;
    },
    end(payload = '') {
      this.body = payload;
    }
  };
}

async function call(handler, method = 'GET', body, headers = {}) {
  const req = createReq(method, body, headers);
  const res = createRes();
  await handler(req, res);
  const payload = JSON.parse(res.body || '{}');
  return { status: res.statusCode, headers: res.headers, payload };
}

const healthResult = await call(health);
assert.equal(healthResult.status, 200);
assert.equal(healthResult.payload.ok, true);
assert.equal(healthResult.payload.privateAccessConfigured, true);

const email = `smoke-${Date.now()}@codego.app`;
const password = `Smoke-${crypto.randomBytes(18).toString('base64url')}`;

const openRegistrationResult = await call(register, 'POST', {
  email: `uninvited-${Date.now()}@codego.app`,
  password,
  inviteCode: 'not-a-valid-private-invite'
});
assert.equal(openRegistrationResult.status, 403);

const registerResult = await call(register, 'POST', {
  email,
  password,
  inviteCode: ownerInvite
});
assert.equal(registerResult.status, 201);
assert.equal(registerResult.payload.user.email, email);
assert.equal(registerResult.payload.user.name, 'Caren van Wyk');
assert.equal(registerResult.payload.user.accessRole, 'admin');
assert.ok(registerResult.headers['set-cookie']);

const duplicateInviteResult = await call(register, 'POST', {
  email: `second-owner-${Date.now()}@codego.app`,
  password,
  inviteCode: ownerInvite
});
assert.equal(duplicateInviteResult.status, 409);

const unknownLoginResult = await call(login, 'POST', {
  email: `unknown-${Date.now()}@codego.app`,
  password
});
assert.equal(unknownLoginResult.status, 401);

const legacyEmail = `legacy-ruan-${Date.now()}@codego.app`;
const legacyPassword = `Legacy-${crypto.randomBytes(18).toString('base64url')}`;
const store = await getStore();
await store.createUser({
  name: 'Legacy account',
  email: legacyEmail,
  passwordHash: await hashPassword(legacyPassword),
  planId: 'starter'
});

const activationRequiredResult = await call(login, 'POST', {
  email: legacyEmail,
  password: legacyPassword
});
assert.equal(activationRequiredResult.status, 403);
assert.equal(activationRequiredResult.payload.code, 'PRIVATE_ACCESS_REQUIRED');
assert.equal(activationRequiredResult.payload.activationRequired, true);

const legacyActivationResult = await call(register, 'POST', {
  email: legacyEmail,
  password: legacyPassword,
  inviteCode: collaboratorInvite
});
assert.equal(legacyActivationResult.status, 200);
assert.equal(legacyActivationResult.payload.user.email, legacyEmail);
assert.equal(legacyActivationResult.payload.user.name, 'Ruan Thomas');
assert.equal(legacyActivationResult.payload.user.accessRole, 'admin');

const activatedLegacyLoginResult = await call(login, 'POST', {
  email: legacyEmail,
  password: legacyPassword
});
assert.equal(activatedLegacyLoginResult.status, 200);
assert.equal(activatedLegacyLoginResult.payload.user.name, 'Ruan Thomas');

const loginResult = await call(login, 'POST', { email, password });
assert.equal(loginResult.status, 200);
assert.equal(loginResult.payload.user.email, email);
const cookie = loginResult.headers['set-cookie'];
assert.ok(cookie);

const authHeaders = { cookie };

const meResult = await call(me, 'GET', undefined, authHeaders);
assert.equal(meResult.status, 200);
assert.equal(meResult.payload.workspace.fileName, 'App.jsx');
assert.equal(meResult.payload.user.aiKeyConfigured, false);

const profileResult = await call(profile, 'PUT', {
  name: 'Smoke Builder',
  workspaceName: 'Smoke Workspace',
  settings: { accent: 'ocean' }
}, authHeaders);
assert.equal(profileResult.status, 200);
assert.equal(profileResult.payload.user.name, 'Smoke Builder');

const keyBeforeResult = await call(aiKey, 'GET', undefined, authHeaders);
assert.equal(keyBeforeResult.status, 200);
assert.equal(keyBeforeResult.payload.configured, false);

const keySaveResult = await call(aiKey, 'PUT', {
  apiKey: 'sk-test-123456789012345678901234567890'
}, authHeaders);
assert.equal(keySaveResult.status, 200);
assert.equal(keySaveResult.payload.configured, true);
assert.equal(keySaveResult.payload.user.aiKeyConfigured, true);
assert.match(keySaveResult.payload.masked, /^sk-test/);

const keyDeleteResult = await call(aiKey, 'DELETE', undefined, authHeaders);
assert.equal(keyDeleteResult.status, 200);
assert.equal(keyDeleteResult.payload.configured, false);

const savedWorkspace = {
  ...meResult.payload.workspace,
  code: 'console.log("saved from smoke test");'
};
const workspaceResult = await call(workspace, 'PUT', { workspace: savedWorkspace }, authHeaders);
assert.equal(workspaceResult.status, 200);
assert.equal(workspaceResult.payload.workspace.code, savedWorkspace.code);

const aiResult = await call(aiGenerate, 'POST', {
  prompt: 'Build a tiny backend route',
  language: 'python',
  library: 'FastAPI',
  workspace: savedWorkspace
}, authHeaders);
assert.equal(aiResult.status, 200);
assert.equal(aiResult.payload.ok, true);
assert.ok(aiResult.payload.code.includes('Build a tiny backend route'));

const checkoutResult = await call(checkoutCreate, 'POST', {
  planId: 'pro',
  provider: 'Stripe',
  payment: { cardNumber: '4242424242424242', expiry: '12/30' }
}, authHeaders);
assert.equal(checkoutResult.status, 200);
assert.equal(checkoutResult.payload.mode, 'test_paid');

console.log('Backend smoke tests passed');
