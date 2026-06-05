/**
 * scripts/encrypt-existing-tokens.ts
 *
 * One-time migration: encrypts all plaintext GitHub OAuth tokens
 * stored in the GitHubData table using AES-256-GCM.
 *
 * Usage:
 *   TOKEN_ENCRYPTION_KEY=<your-key> npx tsx scripts/encrypt-existing-tokens.ts
 *
 * Prerequisites:
 *   1. Add TOKEN_ENCRYPTION_KEY to your .env (min 32 chars):
 *        openssl rand -hex 32
 *   2. The key MUST be the same one the app will use going forward.
 *
 * The script is idempotent — already-encrypted tokens (prefixed `enc:`)
 * are automatically skipped so it is safe to re-run.
 */

import crypto from 'crypto';

// ── Minimal inline encrypt (avoids importing compiled Next.js modules) ────────
const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    console.error('❌  TOKEN_ENCRYPTION_KEY must be set and at least 32 characters.');
    console.error('    Generate one with: openssl rand -hex 32');
    process.exit(1);
  }
  return crypto.createHash('sha256').update(raw).digest();
}

function encryptToken(plaintext: string): string {
  if (!plaintext || plaintext.startsWith('enc:')) return plaintext;
  const key = getKey();
  const iv  = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag   = cipher.getAuthTag();
  return `enc:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

// ── Prisma ────────────────────────────────────────────────────────────────────
// Use dynamic import so this file works with `tsx` directly.
async function run() {
  console.log('\ud83d\udd10  Starting GitHub token encryption migration...\n');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('\u274c  DATABASE_URL is not set.');
    process.exit(1);
  }

  // Use raw pg — avoids Prisma adapter compatibility issues in script context
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: dbUrl });
  const client = await pool.connect();

  try {
    const { rows } = await client.query<{ id: string; userId: string; accessToken: string | null }>(
      'SELECT id, "userId", "accessToken" FROM "GitHubData"'
    );

    console.log(`   Found ${rows.length} GitHubData record(s) to check.\n`);

    let encrypted = 0;
    let skipped   = 0;
    let empty     = 0;

    for (const record of rows) {
      const token = record.accessToken;

      if (!token) {
        empty++;
        continue;
      }

      // Already encrypted — skip
      if (token.startsWith('enc:')) {
        console.log(`   \u23ed  userId=${record.userId} \u2014 already encrypted, skipped.`);
        skipped++;
        continue;
      }

      const encryptedToken = encryptToken(token);
      await client.query(
        'UPDATE "GitHubData" SET "accessToken" = $1 WHERE id = $2',
        [encryptedToken, record.id]
      );

      console.log(`   \u2705  userId=${record.userId} \u2014 encrypted successfully.`);
      encrypted++;
    }

    console.log(`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
  Migration complete!
  \u2705  Encrypted : ${encrypted}
  \u23ed  Skipped   : ${skipped}  (already encrypted)
  \u25a1  Empty     : ${empty}   (no token stored)
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('❌  Migration failed:', err);
  process.exit(1);
});
