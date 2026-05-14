import { Readable } from 'node:stream';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

import health from '../api/health.js';
import register from '../api/auth/register.js';
import login from '../api/auth/login.js';
import me from '../api/me.js';
import profile from '../api/profile.js';
import workspace from '../api/workspace.js';
import aiGenerate from '../api/ai/generate.js';
import checkoutCreate from '../api/checkout/create.js';

process.env.APP_JWT_SECRET = 'backend-smoke-test-secret';
process.env.ALLOW_TEST_AI = 'true';
process.env.ALLOW_TEST_PAYMENTS = 'true';
process.env.LOCAL_DB_PATH = path.join(process.cwd(), '.data', `backend-smoke-${Date.now()}.json`);

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

const email = `smoke-${Date.now()}@codego.app`;
const registerResult = await call(register, 'POST', {
  name: 'Smoke Tester',
  email,
  password: 'demo123',
  planId: 'pro'
});
assert.equal(registerResult.status, 201);
assert.equal(registerResult.payload.user.email, email);
assert.ok(registerResult.headers['set-cookie']);

const loginResult = await call(login, 'POST', { email, password: 'demo123' });
assert.equal(loginResult.status, 200);
assert.equal(loginResult.payload.user.email, email);
const cookie = loginResult.headers['set-cookie'];
assert.ok(cookie);

const authHeaders = { cookie };

const meResult = await call(me, 'GET', undefined, authHeaders);
assert.equal(meResult.status, 200);
assert.equal(meResult.payload.workspace.fileName, 'App.jsx');

const profileResult = await call(profile, 'PUT', {
  name: 'Smoke Builder',
  workspaceName: 'Smoke Workspace',
  settings: { accent: 'ocean' }
}, authHeaders);
assert.equal(profileResult.status, 200);
assert.equal(profileResult.payload.user.name, 'Smoke Builder');

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
