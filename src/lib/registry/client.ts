import type {
  RawServersResponse,
  NormalizedServer,
  ApiResult,
  FetchServersOptions,
} from "./types"
import { transformEntry, nameToSlug } from "./transform"

const BASE_URL = "https://registry.modelcontextprotocol.io/v0"

// How long Next.js caches this fetch on the server (seconds)
const CACHE_TTL = 300 // 5 minutes

// ─── Low-level fetch ──────────────────────────────────────────────────────────

async function fetchPage(
  cursor?: string,
  pageSize = 100
): Promise<ApiResult<RawServersResponse>> {
  const url = new URL(`${BASE_URL}/servers`)
  url.searchParams.set("limit", String(pageSize))
  if (cursor) url.searchParams.set("cursor", cursor)

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: CACHE_TTL },
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      return {
        ok: false,
        error: `Registry returned ${res.status} ${res.statusText}`,
        status: res.status,
      }
    }

    const json = await res.json() as RawServersResponse

    // Basic shape validation
    if (!Array.isArray(json?.servers)) {
      return { ok: false, error: "Unexpected response shape from registry" }
    }

    return { ok: true, data: json }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fetch error"
    return { ok: false, error: `Failed to reach registry: ${message}` }
  }
}

// ─── Paginated fetch — collects all pages up to `limit` ──────────────────────

export async function fetchAllServers(
  options: FetchServersOptions = {}
): Promise<ApiResult<NormalizedServer[]>> {
  const { limit = 500, latestOnly = true } = options

  const collected: NormalizedServer[] = []
  let cursor: string | undefined
  let pages = 0
  const MAX_PAGES = 20 // safety cap — avoids infinite loops

  while (collected.length < limit && pages < MAX_PAGES) {
    const result = await fetchPage(cursor, 100)

    if (!result.ok) {
      // Return whatever we have so far if we already have some data,
      // otherwise surface the error
      if (collected.length > 0) break
      return result
    }

    const { servers, metadata } = result.data

    for (const entry of servers) {
      try {
        const normalized = transformEntry(entry)
        if (latestOnly && !normalized.isLatest) continue
        collected.push(normalized)
        if (collected.length >= limit) break
      } catch {
        // Skip malformed entries silently
      }
    }

    if (!metadata.nextCursor) break
    cursor = metadata.nextCursor
    pages++
  }

  return { ok: true, data: collected }
}

// ─── Single server fetch by slug ─────────────────────────────────────────────

export async function fetchServerBySlug(
  slug: string
): Promise<ApiResult<NormalizedServer | null>> {
  const result = await fetchAllServers({ limit: 1000, latestOnly: true })
  if (!result.ok) return result
  const server = result.data.find(s => s.slug === slug) ?? null
  return { ok: true, data: server }
}

// ─── Single server fetch by name ─────────────────────────────────────────────

export async function fetchServerByName(
  name: string
): Promise<ApiResult<NormalizedServer | null>> {
  const result = await fetchAllServers({ limit: 1000, latestOnly: true })
  if (!result.ok) return result
  const server = result.data.find(s => s.name === name) ?? null
  return { ok: true, data: server }
}
