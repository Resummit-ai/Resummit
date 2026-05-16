import { Redis } from "@upstash/redis";
import crypto from "crypto";

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Generates a stable cache key based on the payload and a namespace.
 */
export function generateCacheKey(namespace: string, payload: any): string {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  return `sclade:${namespace}:${hash}`;
}

/**
 * Gets a value from the cache.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error("[CACHE] Get Error:", error);
    return null;
  }
}

/**
 * Sets a value in the cache with a default TTL of 24 hours.
 */
export async function setCache(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("[CACHE] Set Error:", error);
  }
}

/**
 * A wrapper to handle the entire get-or-fetch-and-set flow.
 */
export async function withCache<T>(
  namespace: string,
  payload: any,
  fetcher: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const key = generateCacheKey(namespace, payload);
  
  // Try to get from cache
  const cached = await getCache<T>(key);
  if (cached) {
    console.log(`[CACHE] Hit: ${key}`);
    return cached;
  }

  // Fetch new data
  console.log(`[CACHE] Miss: ${key}. Fetching...`);
  const freshData = await fetcher();
  
  // Save to cache
  await setCache(key, freshData, ttlSeconds);
  
  return freshData;
}
