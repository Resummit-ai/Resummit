import 'server-only';
// @ts-ignore
import { prisma as db } from './db.js';

export const prisma = db;

/**
 * Robustly resolves the database User ID from a session.
 * Handles cases where session.user.id might be a provider ID (numeric)
 * by falling back to email-based lookup. If no user row exists for the email,
 * it auto-provisions one — ensuring FK constraints on related tables never fail.
 */
export async function resolveUserId(session: any): Promise<string | null> {
  if (!session?.user) return null;
  const id = session.user.id;
  const email = session.user.email;
  const name = session.user.name || session.user.email || 'GitHub User';

  // If the ID is already a CUID, verify it exists in DB
  if (id && id.startsWith('c')) {
    const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (exists) return exists.id;
    // CUID doesn't exist in DB — fall through to email upsert
  }

  // Resolve or create via email (the always-reliable unique identifier)
  if (email) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name },
      create: { email, name, image: session.user.image || null },
      select: { id: true }
    });
    return user.id;
  }

  return null;
}
