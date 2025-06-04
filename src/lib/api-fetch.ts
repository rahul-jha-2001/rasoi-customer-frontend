
import { makeCacheKey, saveCache, getCache, invalidatePrefix,invalidateCache } from "./rediscache";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function makeAuthHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const CACHE_TTL = 60 * 5; // 5 minutes in seconds

// ====== Shared Fetcher ======
async function apiFetch<T>(
  path: string,
  method: string,
  token: string|null,
  body?: any,
  useCache = true,
  identifiers: { userUuid?: string; storeUuid?: string } = {}
): Promise<T> {
  const isGET = method === "GET";
  const cacheKey = makeCacheKey(path, identifiers);
  console.log("🔍 using cache key:", cacheKey, "useCache:", useCache, "isGET:", isGET);

  if (isGET && useCache) {
    const cached = await getCache<T>(cacheKey); // ⬅️ await here
    console.log(`[CACHE ${cached ? "HIT" : "MISS"}] ${cacheKey}`);
    if (cached) return cached;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: token ? makeAuthHeaders(token) : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  if (isGET && useCache) {
    await saveCache(cacheKey, data, CACHE_TTL); // ⬅️ correct function & TTL
  }

  return data;
}

export {
  apiFetch,
  makeAuthHeaders,
  makeCacheKey,
  invalidateCache,
};
