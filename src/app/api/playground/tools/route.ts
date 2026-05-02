/**
 * GET /api/playground/tools?serverSlug=<slug>
 *
 * Fetches the real tools/list from a remote MCP server.
 * Runs server-side — the browser never touches the MCP endpoint directly.
 *
 * Returns:
 *   { tools: MCPTool[], serverName: string, remoteUrl: string }
 */

import { NextRequest, NextResponse } from "next/server"
import { lookupServerBySlug } from "@/lib/registry/lookup"
import { fetchToolsFromRemote } from "@/lib/playground/mcp-client"

// Node runtime — edge doesn't support the full fetch + SSE parsing we need
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("serverSlug")

  if (!slug || typeof slug !== "string" || slug.length > 200) {
    return NextResponse.json({ error: "Missing or invalid serverSlug" }, { status: 400 })
  }

  // Resolve the server — use in-memory cache for fast repeated lookups
  const serverResult = await lookupServerBySlug(slug)
  if (!serverResult.ok) {
    return NextResponse.json({ error: serverResult.error }, { status: 502 })
  }
  const server = serverResult.data
  if (!server) {
    return NextResponse.json({ error: "Server not found in registry" }, { status: 404 })
  }

  if (!server.hasRemote || server.remoteUrls.length === 0) {
    return NextResponse.json(
      {
        error: "no_remote",
        message: "This server does not expose a remote HTTP endpoint. It must be run locally.",
        githubUrl: server.githubUrl,
        websiteUrl: server.websiteUrl,
      },
      { status: 422 }
    )
  }

  const remoteUrl = server.remoteUrls[0]

  // Validate URL — must be https
  try {
    const parsed = new URL(remoteUrl)
    if (parsed.protocol !== "https:") {
      return NextResponse.json(
        { error: "Remote URL must use HTTPS" },
        { status: 422 }
      )
    }
  } catch {
    return NextResponse.json({ error: "Invalid remote URL" }, { status: 422 })
  }

  try {
    const toolsResult = await fetchToolsFromRemote(remoteUrl)

    return NextResponse.json(
      {
        tools: toolsResult.tools ?? [],
        serverName: server.name,
        displayName: server.displayName,
        remoteUrl,
      },
      {
        headers: {
          // Cache tool lists for 2 minutes — they rarely change
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
        },
      }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"

    // Classify the error for the UI
    if (message.includes("abort") || message.includes("timeout")) {
      return NextResponse.json(
        { error: "timeout", message: "The server did not respond within 15 seconds." },
        { status: 504 }
      )
    }
    if (message.includes("ECONNREFUSED") || message.includes("ENOTFOUND")) {
      return NextResponse.json(
        { error: "unreachable", message: "Could not connect to the remote server." },
        { status: 502 }
      )
    }
    if (message.includes("HTTP 401") || message.includes("HTTP 403")) {
      return NextResponse.json(
        {
          error: "auth_required",
          message: "This server requires authentication. You need an API key to connect.",
          githubUrl: server.githubUrl,
          websiteUrl: server.websiteUrl,
        },
        { status: 422 }
      )
    }
    if (message.includes("HTTP 404")) {
      return NextResponse.json(
        {
          error: "auth_required",
          message: "This server returned 404. It likely requires an API key or personal token to access.",
          githubUrl: server.githubUrl,
          websiteUrl: server.websiteUrl,
        },
        { status: 422 }
      )
    }
    // Check if the response was HTML (auth redirect / login page)
    if (message.includes("<!DOCTYPE") || message.includes("Unexpected token")) {
      return NextResponse.json(
        {
          error: "auth_required",
          message: "This server returned a non-MCP response. It likely requires authentication.",
          githubUrl: server.githubUrl,
          websiteUrl: server.websiteUrl,
        },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { error: "execution_failed", message },
      { status: 502 }
    )
  }
}
