import crypto from 'node:crypto';

const algorithm = 'aes-256-gcm';

function getEncryptionKey() {
  const secret = process.env.APP_ENCRYPTION_KEY || process.env.APP_JWT_SECRET || 'dev-only-code-on-the-go-encryption';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url')
  ].join('.');
}

export function decryptSecret(ciphertext) {
  if (!ciphertext) {
    return null;
  }

  const [ivValue, tagValue, encryptedValue] = ciphertext.split('.');
  const decipher = crypto.createDecipheriv(
    algorithm,
    getEncryptionKey(),
    Buffer.from(ivValue, 'base64url')
  );
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final()
  ]).toString('utf8');
}

export function maskSecret(value) {
  if (!value) {
    return null;
  }

  if (value.length <= 12) {
    return '****';
  }

  return `${value.slice(0, 7)}...${value.slice(-4)}`;
}

export function validateOpenAiKey(value) {
  const key = value.trim();

  if (key.length < 20) {
    return { ok: false, message: 'Enter a valid OpenAI API key.' };
  }

  if (!key.startsWith('sk-')) {
    return { ok: false, message: 'OpenAI API keys usually start with sk-.' };
  }

  return { ok: true, key };
}
