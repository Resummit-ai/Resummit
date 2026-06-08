import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { logger } from './logger';

// ── Redis client (shared with cache.ts) ──────────────────────────────────────
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (REDIS_URL && REDIS_TOKEN && REDIS_URL.startsWith('https://')) {
  try {
    redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  } catch {
    redis = null;
  }
}

// ── Rate limiters — one per endpoint family ──────────────────────────────────
function makeRatelimiter(requests: number, windowSeconds: number) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
  });
}

const limiters = {
  /** 3 syncs/hour per user — each sync makes 50+ GitHub API calls */
  githubSync:          makeRatelimiter(3,  3600),
  /** 5 ATS audits/hour per user (each calls Gemini) */
  atsScore:            makeRatelimiter(5,  3600),
  /** 10 AI regenerations/hour per user */
  regenerate:          makeRatelimiter(10, 3600),
  /** 30 saves/hour per user — non-AI endpoint */
  cvSave:              makeRatelimiter(30, 3600),
  /** 5 suggestion fetches/hour */
  suggestions:         makeRatelimiter(5,  3600),
  /** 5 feedback submissions/hour per IP */
  feedback:            makeRatelimiter(5,  3600),
} as const;

type LimiterKey = keyof typeof limiters;

/**
 * Check rate limit for the given userId + endpoint.
 *
 * Returns `null` if the request is allowed, or a `NextResponse` with 429
 * status if the limit is exceeded. If Redis is unavailable, always allows.
 *
 * Usage:
 * ```ts
 * const limited = await checkRateLimit(userId, 'githubSync');
 * if (limited) return limited;
 * ```
 */
export async function checkRateLimit(
  userId: string,
  endpoint: LimiterKey
): Promise<NextResponse | null> {
  const limiter = limiters[endpoint];
  if (!limiter) return null; // Redis offline → allow

  const { success, limit, remaining, reset } = await limiter.limit(
    `${endpoint}:${userId}`
  );

  if (!success) {
    logger.ratelimit({ userId, endpoint, limit });
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests. Please wait before trying again.',
        retryAfterSeconds: retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }

  return null;
}
