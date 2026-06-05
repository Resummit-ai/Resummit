import 'server-only';

/**
 * Structured logger — outputs JSON-formatted log lines compatible with
 * Vercel log drain, Axiom, and Datadog. Falls back to console in dev.
 */
type LogLevel = 'info' | 'warn' | 'error';

function emit(level: LogLevel, event: string, data: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    env: process.env.NODE_ENV,
    ...data,
  };
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  /** Log an AI call with token usage and estimated cost */
  ai(params: {
    userId: string;
    feature: string;
    model: string;
    promptTokens?: number;
    candidateTokens?: number;
    totalTokens?: number;
    durationMs?: number;
    cached?: boolean;
  }) {
    // gemini-2.0-flash pricing: ~$0.075/1M tokens input, $0.30/1M output
    const inputCost = ((params.promptTokens ?? 0) / 1_000_000) * 0.075;
    const outputCost = ((params.candidateTokens ?? 0) / 1_000_000) * 0.30;
    emit('info', 'ai.call', {
      ...params,
      estimatedCostUSD: parseFloat((inputCost + outputCost).toFixed(6)),
    });
  },

  /** Log a GitHub sync operation */
  sync(params: {
    userId: string;
    repoCount: number;
    aiRepos: number;
    deterministicRepos: number;
    durationMs: number;
    skipped?: boolean;
    reason?: string;
  }) {
    emit('info', 'github.sync', params);
  },

  /** Log an auth event */
  auth(event: string, params: { userId?: string; provider?: string; email?: string }) {
    emit('info', `auth.${event}`, params);
  },

  /** Log a rate limit breach */
  ratelimit(params: { userId: string; endpoint: string; limit: number }) {
    emit('warn', 'ratelimit.exceeded', params);
  },

  /** Log a security event (token encryption, etc.) */
  security(event: string, params: Record<string, unknown>) {
    emit('warn', `security.${event}`, params);
  },

  /** Log an error with optional context */
  error(event: string, error: unknown, params?: Record<string, unknown>) {
    emit('error', event, {
      ...(params ?? {}),
      error: error instanceof Error ? error.message : String(error),
    });
  },
};
