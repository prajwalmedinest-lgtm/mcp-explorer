import { NextRequest, NextResponse } from "next/server"
import { fetchServerBySlug } from "@/lib/registry"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const result = await fetchServerBySlug(slug)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 502 })
  }

  if (!result.data) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 })
  }

  return NextResponse.json(result.data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  })
}
