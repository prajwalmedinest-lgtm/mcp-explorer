/**
 * POST /api/playground/execute
 *
 * Executes a real MCP tool/call on a remote server.
 * All execution is server-side — the browser never touches the MCP endpoint.
 *
 * Body: { serverSlug: string, toolName: string, arguments: Record<string, unknown> }
 *
 * Returns: ExecutionResult
 */

import { NextRequest, NextResponse } from "next/server"
import { lookupServerBySlug } from "@/lib/registry/lookup"
import { executeToolOnRemote } from "@/lib/playground/mcp-client"
import type { ExecutionResult } from "@/lib/playground/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ─── Input validation ─────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function sanitizeArguments(args: unknown): Record<string, unknown> {
  if (!isPlainObject(args)) return {}
  // Limit depth and size to prevent abuse
  const str = JSON.stringify(args)
  if (str.length > 50_000) throw new Error("Arguments payload too large (max 50 KB)")
  return args
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isPlainObject(body)) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 })
  }

  const { serverSlug, toolName, arguments: toolArgs } = body as {
    serverSlug?: unknown
    toolName?: unknown
    arguments?: unknown
  }

  // Validate inputs
  if (typeof serverSlug !== "string" || serverSlug.length === 0 || serverSlug.length > 200) {
    return NextResponse.json({ error: "Missing or invalid serverSlug" }, { status: 400 })
  }
  if (typeof toolName !== "string" || toolName.length === 0 || toolName.length > 200) {
    return NextResponse.json({ error: "Missing or invalid toolName" }, { status: 400 })
  }

  let sanitizedArgs: Record<string, unknown>
  try {
    sanitizedArgs = sanitizeArguments(toolArgs ?? {})
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid arguments" },
      { status: 400 }
    )
  }

  // Resolve server from registry (in-memory cache after first load)
  const serverResult = await lookupServerBySlug(serverSlug)
  if (!serverResult.ok) {
    return NextResponse.json({ error: serverResult.error }, { status: 502 })
  }
  const server = serverResult.data
  if (!server) {
    return NextResponse.json({ error: "Server not found in registry" }, { status: 404 })
  }

  if (!server.hasRemote || server.remoteUrls.length === 0) {
    const result: ExecutionResult = {
      ok: false,
      status: "error",
      durationMs: 0,
      tool: toolName,
      serverName: server.name,
      remoteUrl: "",
      request: {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: toolName, arguments: sanitizedArgs },
      },
      error: "no_remote",
    }
    return NextResponse.json(result, { status: 422 })
  }

  const remoteUrl = server.remoteUrls[0]

  // Validate URL
  try {
    const parsed = new URL(remoteUrl)
    if (parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Remote URL must use HTTPS" }, { status: 422 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid remote URL" }, { status: 422 })
  }

  const startMs = Date.now()

  const requestPayload = {
    jsonrpc: "2.0" as const,
    id: 1,
    method: "tools/call",
    params: { name: toolName, arguments: sanitizedArgs },
  }

  try {
    const { result: toolResult } = await executeToolOnRemote(
      remoteUrl,
      toolName,
      sanitizedArgs
    )

    const durationMs = Date.now() - startMs

    const execResult: ExecutionResult = {
      ok: !toolResult.isError,
      status: toolResult.isError ? "error" : "success",
      durationMs,
      tool: toolName,
      serverName: server.name,
      remoteUrl,
      request: requestPayload,
      content: toolResult.content,
      isError: toolResult.isError,
    }

    return NextResponse.json(execResult)
  } catch (err) {
    const durationMs = Date.now() - startMs
    const message = err instanceof Error ? err.message : "Unknown error"

    let errorCode = "execution_failed"
    if (message.includes("abort") || message.includes("timeout")) errorCode = "timeout"
    else if (message.includes("ECONNREFUSED") || message.includes("ENOTFOUND")) errorCode = "unreachable"
    else if (message.includes("HTTP 4")) errorCode = "server_error"

    const execResult: ExecutionResult = {
      ok: false,
      status: "error",
      durationMs,
      tool: toolName,
      serverName: server.name,
      remoteUrl,
      request: requestPayload,
      error: errorCode,
    }

    return NextResponse.json(execResult, { status: 502 })
  }
}
