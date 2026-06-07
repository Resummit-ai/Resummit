"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
require("server-only");
function emit(level, event, data) {
    const entry = {
        ts: new Date().toISOString(),
        level,
        event,
        env: process.env.NODE_ENV,
        ...data,
    };
    if (level === 'error') {
        console.error(JSON.stringify(entry));
    }
    else if (level === 'warn') {
        console.warn(JSON.stringify(entry));
    }
    else {
        console.log(JSON.stringify(entry));
    }
}
exports.logger = {
    /** Log an AI call with token usage and estimated cost */
    ai(params) {
        // gemini-2.0-flash pricing: ~$0.075/1M tokens input, $0.30/1M output
        const inputCost = ((params.promptTokens ?? 0) / 1000000) * 0.075;
        const outputCost = ((params.candidateTokens ?? 0) / 1000000) * 0.30;
        emit('info', 'ai.call', {
            ...params,
            estimatedCostUSD: parseFloat((inputCost + outputCost).toFixed(6)),
        });
    },
    /** Log a GitHub sync operation */
    sync(params) {
        emit('info', 'github.sync', params);
    },
    /** Log an auth event */
    auth(event, params) {
        emit('info', `auth.${event}`, params);
    },
    /** Log a rate limit breach */
    ratelimit(params) {
        emit('warn', 'ratelimit.exceeded', params);
    },
    /** Log a security event (token encryption, etc.) */
    security(event, params) {
        emit('warn', `security.${event}`, params);
    },
    /** Log an error with optional context */
    error(event, error, params) {
        emit('error', event, {
            ...(params ?? {}),
            error: error instanceof Error ? error.message : String(error),
        });
    },
};
