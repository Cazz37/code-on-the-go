import { clearSessionCookie } from '../_lib/auth.js';
import { sendJson, requireMethod } from '../_lib/http.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  sendJson(
    res,
    200,
    { ok: true },
    { 'Set-Cookie': clearSessionCookie() }
  );
}
