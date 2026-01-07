/**
 * Simple in-memory cache for Supabase queries
 * Prevents duplicate API calls within a short time window
 */

const cache = new Map();
const DEFAULT_TTL = 30000; // 30 seconds
const pendingRequests = new Map();

/**
 * Generate a cache key from query parameters
 */
function generateKey(table, query) {
  return `${table}:${JSON.stringify(query)}`;
}

/**
 * Get cached data if still valid
 */
export function getCached(table, query) {
  const key = generateKey(table, query);
  const cached = cache.get(key);

  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // Clean up expired entry
  if (cached) {
    cache.delete(key);
  }

  return null;
}

/**
 * Store data in cache
 */
export function setCache(table, query, data, ttl = DEFAULT_TTL) {
  const key = generateKey(table, query);
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

/**
 * Invalidate cache for a specific table (call after mutations)
 */
export function invalidateTable(table) {
  for (const key of cache.keys()) {
    if (key.startsWith(`${table}:`)) {
      cache.delete(key);
    }
  }
}

/**
 * Invalidate all cache
 */
export function invalidateAll() {
  cache.clear();
}

/**
 * Deduplicate concurrent requests for the same data
 * If multiple components request the same data simultaneously,
 * only one actual API call is made
 */
export async function dedupeRequest(key, fetchFn) {
  // If there's already a pending request for this key, wait for it
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Create the promise and store it
  const promise = fetchFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Cached fetch wrapper for Supabase queries
 *
 * Usage:
 *   const { data, error } = await cachedQuery(
 *     supabase.from('cities').select('*'),
 *     'cities',
 *     { select: '*' },
 *     60000 // optional TTL in ms
 *   );
 */
export async function cachedQuery(queryBuilder, table, queryParams, ttl = DEFAULT_TTL) {
  // Check cache first
  const cached = getCached(table, queryParams);
  if (cached !== null) {
    return { data: cached, error: null, fromCache: true };
  }

  // Dedupe concurrent requests
  const key = generateKey(table, queryParams);
  const result = await dedupeRequest(key, async () => {
    const response = await queryBuilder;
    if (!response.error && response.data) {
      setCache(table, queryParams, response.data, ttl);
    }
    return response;
  });

  return { ...result, fromCache: false };
}

// Export cache stats for debugging
export function getCacheStats() {
  return {
    size: cache.size,
    pendingRequests: pendingRequests.size,
  };
}
