const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function makeAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_PREFIX = "api-cache:";

function makeCacheKey(path: string, identifiers: { userUuid?: string; storeUuid?: string }): string {
  const id = identifiers.userUuid || identifiers.storeUuid || "global";
  const key = `${id}:${path}`;
  console.log("🔑 Cache key using:", key);
  return key;
}

function getCachedResponse<T>(key: string): T | null {
  const raw = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!raw) {
    console.log("🚫 Cache not found for key:", key);
    return null;
  }

  try {
    const { timestamp, data } = JSON.parse(raw);
    const age = Date.now() - timestamp;
    console.log("📦 Cache found:", { key, age, TTL: CACHE_TTL, valid: age < CACHE_TTL });
    if (age < CACHE_TTL) {
      return data;
    } else {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
    }
  } catch (e) {
    console.log("⚠️ Failed to parse cache for key:", key, e);
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
  }

  return null;
}

function setCache(key: string, data: any) {
  const item = JSON.stringify({ timestamp: Date.now(), data });
  localStorage.setItem(CACHE_KEY_PREFIX + key, item);
  console.log("💾 Cache set for key:", key);
}

function invalidatePrefix(prefix: string, identifiers: { userUuid?: string; storeUuid?: string }) {
  const id = identifiers.userUuid || identifiers.storeUuid || "global";
  const match = `${CACHE_KEY_PREFIX}${id}:${prefix}`;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(match)) {
      localStorage.removeItem(k);
    }
  }
}

// ====== Shared Fetcher ======
async function apiFetch<T>(
  path: string,
  method: string,
  token: string,
  body?: any,
  useCache = true,
  identifiers: { userUuid?: string; storeUuid?: string } = {}
): Promise<T> {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const isGET = method === "GET";
  const cacheKey = makeCacheKey(path, identifiers);
  console.log("using cache key:", cacheKey, "useCache:", useCache, "isGET:", isGET);

  if (isGET && useCache) {
    const cached = getCachedResponse<T>(cacheKey);
    console.log(`[CACHE ${cached ? "HIT" : "MISS"}] ${cacheKey}`);
    if (cached) return cached;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: makeAuthHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  if (isGET && useCache) setCache(cacheKey, data);

  return data;
}

export {
  apiFetch,
  makeAuthHeaders,
  makeCacheKey,
  getCachedResponse,
  setCache,
  invalidatePrefix,
};