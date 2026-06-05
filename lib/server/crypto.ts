import 'server-only';
import crypto from 'crypto';
import { logger } from './logger';

const ALGORITHM = 'aes-256-gcm';
const IV_BYTES   = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_BYTES = 16;

/**
 * Derives a 32-byte key from TOKEN_ENCRYPTION_KEY env var.
 * Throws at startup if the key is missing or too short.
 */
function getKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error(
      '[crypto] TOKEN_ENCRYPTION_KEY must be set and at least 32 characters. ' +
      'Generate one with: openssl rand -hex 32'
    );
  }
  // Use SHA-256 so any length key maps to exactly 32 bytes
  return crypto.createHash('sha256').update(raw).digest();
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Output format: `<iv_hex>:<authTag_hex>:<ciphertext_hex>`
 * This format is safe to store in a plain VARCHAR/TEXT column.
 */
export function encryptToken(plaintext: string): string {
  if (!plaintext) return plaintext;
  // Already encrypted (safe re-run guard)
  if (plaintext.startsWith('enc:')) return plaintext;

  try {
    const key = getKey();
    const iv  = crypto.randomBytes(IV_BYTES);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `enc:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (err) {
    logger.error('crypto.encryptToken', err);
    throw err;
  }
}

/**
 * Decrypt a ciphertext produced by `encryptToken`.
 * If the value is NOT prefixed with `enc:`, it is returned as-is
 * (handles the migration window where old plaintext tokens still exist).
 */
export function decryptToken(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  // Not yet encrypted (migration window: old plaintext token)
  if (!ciphertext.startsWith('enc:')) return ciphertext;

  try {
    const key = getKey();
    const parts = ciphertext.slice(4).split(':'); // strip "enc:" prefix
    if (parts.length !== 3) throw new Error('Invalid encrypted token format');

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv       = Buffer.from(ivHex,       'hex');
    const authTag  = Buffer.from(authTagHex,  'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
  } catch (err) {
    logger.error('crypto.decryptToken', err);
    throw err;
  }
}

/**
 * Returns true if the token value is already encrypted.
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith('enc:');
}
