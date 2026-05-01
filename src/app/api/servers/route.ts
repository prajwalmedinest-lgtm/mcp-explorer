import { NextRequest, NextResponse } from "next/server"
import { fetchAllServers } from "@/lib/registry"
import { filterServers } from "@/lib/registry"
import type { ServerCategory, SearchOptions } from "@/lib/registry"

export const runtime = "edge"
// Revalidate the underlying fetch cache every 5 minutes;
// this route itself is always dynamic (search params vary)
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const query    = searchParams.get("q") ?? ""
  const category = (searchParams.get("category") ?? "all") as ServerCategory | "all"
  const sort     = (searchParams.get("sort") ?? "name") as SearchOptions["sort"]
  const limitRaw = searchParams.get("limit")
  const limit    = limitRaw ? Math.min(parseInt(limitRaw, 10), 500) : 200

  // Fetch from registry (cached at the fetch level for 5 min)
  const result = await fetchAllServers({ limit: 500, latestOnly: true })

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 502 }
    )
  }

  // Apply search / filter / sort in-process
  const filtered = filterServers(result.data, { query, category, sort, limit })

  return NextResponse.json(
    {
      servers: filtered,
      total: result.data.length,
      filtered: filtered.length,
    },
    {
      headers: {
        // Allow the browser to cache for 60 s, CDN for 5 min
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    }
  )
}
