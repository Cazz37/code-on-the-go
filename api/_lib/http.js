export function sendJson(res, statusCode, body, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
}

export function sendError(res, statusCode, message, details) {
  sendJson(res, statusCode, {
    ok: false,
    error: message,
    ...(details ? { details } : {})
  });
}

export async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody.trim()) {
    return {};
  }

  return JSON.parse(rawBody);
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export function requireMethod(req, res, method) {
  if (req.method !== method) {
    sendError(res, 405, `Use ${method} for this endpoint.`);
    return false;
  }

  return true;
}

export function getOrigin(req) {
  const host = req.headers['x-forwarded-host'] ?? req.headers.host ?? 'localhost:5173';
  const protocol = req.headers['x-forwarded-proto'] ?? (host.includes('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}
