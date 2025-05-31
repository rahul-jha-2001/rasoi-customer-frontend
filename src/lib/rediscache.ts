import redis from "./redis";

const DEFAULT_TTL = 60 * 5; // 5 minutes in seconds

export function makeCacheKey(
  path: string,
  identifiers: { userUuid?: string; storeUuid?: string }
): string {
  const id = identifiers.userUuid || identifiers.storeUuid || "global";
  const key = `api-cache:${id}:${path}`;  // Optional: add consistent prefix
  console.log("🔑 Cache key using:", key);
  return key;
}

export async function saveCache(
  key: string,
  value: any,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await redis.set(key, json, "EX", ttl);
    console.log("💾 Saved to Redis:", key);
  } catch (err) {
    console.error("❌ Error saving to Redis:", err);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const json = await redis.get(key);
    if (!json) return null;
    const parsed: T = JSON.parse(json);
    console.log("✅ Cache hit:", key);
    return parsed;
  } catch (err) {
    console.error("❌ Error reading from Redis:", err);
    return null;
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
    console.log("🗑️ Cache invalidated:", key);
  } catch (err) {
    console.error("❌ Error invalidating cache:", err);
  }
}

export async function invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`🧹 Invalidated ${keys.length} keys with prefix: ${prefix}`);
      }
    } catch (err) {
      console.error("❌ Error invalidating by prefix:", err);
    }
  }
  