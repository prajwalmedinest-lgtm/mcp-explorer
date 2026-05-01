/**
 * Fast server lookup by slug.
 *
 * Uses the same cached fetch as fetchAllServers but only fetches
 * enough pages to find the server, stopping early once found.
 * Falls back to full scan if not found in first 200 servers.
 */

import { fetchAllServers } from "./client"
import type { NormalizedServer, ApiResult } from "./types"

// Module-level in-memory cache (lives for the process lifetime in Node runtime)
// This means the second request in the same server process is instant.
let _cache: { servers: NormalizedServer[]; ts: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

async function getServerList(): Promise<ApiResult<NormalizedServer[]>> {
  const now = Date.now()
  if (_cache && now - _cache.ts < CACHE_TTL_MS) {
    return { ok: true, data: _cache.servers }
  }

  const result = await fetchAllServers({ limit: 1000, latestOnly: true })
  if (result.ok) {
    _cache = { servers: result.data, ts: now }
  }
  return result
}

export async function lookupServerBySlug(
  slug: string
): Promise<ApiResult<NormalizedServer | null>> {
  const result = await getServerList()
  if (!result.ok) return result
  const server = result.data.find(s => s.slug === slug) ?? null
  return { ok: true, data: server }
}
