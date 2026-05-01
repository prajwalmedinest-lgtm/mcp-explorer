/**
 * MCP Streamable-HTTP client
 *
 * Implements the MCP 2025-03-26 Streamable HTTP transport spec.
 * All calls are server-side only (called from API routes).
 *
 * Flow:
 *   1. POST initialize  → get session ID + server capabilities
 *   2. POST tools/list  → enumerate available tools + schemas
 *   3. POST tools/call  → execute a specific tool
 */

import type {
  JsonRpcRequest,
  JsonRpcResponse,
  InitializeParams,
  InitializeResult,
  ToolsListResult,
  ToolCallParams,
  ToolCallResult,
} from "./types"

const CLIENT_INFO = { name: "mcp-explorer-playground", version: "1.0.0" }
const PROTOCOL_VERSION = "2025-03-26"
const TIMEOUT_MS = 15_000

// ─── Low-level JSON-RPC POST ──────────────────────────────────────────────────

async function rpcPost(
  url: string,
  request: JsonRpcRequest,
  sessionId?: string,
  signal?: AbortSignal
): Promise<{ response: JsonRpcResponse; sessionId?: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  }
  if (sessionId) headers["Mcp-Session-Id"] = sessionId

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
    signal,
    // No Next.js caching — playground calls must always be fresh
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }

  const newSessionId = res.headers.get("Mcp-Session-Id") ?? undefined
  const contentType = res.headers.get("Content-Type") ?? ""

  let body: JsonRpcResponse

  if (contentType.includes("text/event-stream")) {
    // Parse SSE stream — collect the first data event that is a JSON-RPC response
    const text = await res.text()
    const lines = text.split("\n")
    let jsonStr = ""
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        jsonStr = line.slice(6).trim()
        break
      }
    }
    if (!jsonStr) throw new Error("Empty SSE stream — no data event received")
    body = JSON.parse(jsonStr) as JsonRpcResponse
  } else {
    body = await res.json() as JsonRpcResponse
  }

  return { response: body, sessionId: newSessionId }
}

// ─── MCP session ─────────────────────────────────────────────────────────────

export class MCPSession {
  private url: string
  private sessionId?: string
  private idCounter = 1

  constructor(url: string) {
    this.url = url
  }

  private nextId() {
    return this.idCounter++
  }

  /** Step 1: Initialize the MCP session */
  async initialize(signal?: AbortSignal): Promise<InitializeResult> {
    const params: InitializeParams = {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: CLIENT_INFO,
    }

    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.nextId(),
      method: "initialize",
      params,
    }

    const { response, sessionId } = await rpcPost(this.url, req, undefined, signal)
    if (sessionId) this.sessionId = sessionId

    if (response.error) {
      throw new Error(`Initialize failed: ${response.error.message}`)
    }

    // Send initialized notification (fire-and-forget, no response expected)
    const notif: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.nextId(),
      method: "notifications/initialized",
    }
    // Best-effort — ignore errors
    rpcPost(this.url, notif, this.sessionId, signal).catch(() => {})

    return response.result as InitializeResult
  }

  /** Step 2: List available tools */
  async listTools(signal?: AbortSignal): Promise<ToolsListResult> {
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.nextId(),
      method: "tools/list",
      params: {},
    }

    const { response } = await rpcPost(this.url, req, this.sessionId, signal)

    if (response.error) {
      throw new Error(`tools/list failed: ${response.error.message}`)
    }

    return response.result as ToolsListResult
  }

  /** Step 3: Call a tool */
  async callTool(params: ToolCallParams, signal?: AbortSignal): Promise<ToolCallResult> {
    const req: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.nextId(),
      method: "tools/call",
      params,
    }

    const { response } = await rpcPost(this.url, req, this.sessionId, signal)

    if (response.error) {
      throw new Error(`tools/call failed: ${response.error.message}`)
    }

    return response.result as ToolCallResult
  }

  /** Terminate the session (best-effort) */
  async terminate(): Promise<void> {
    if (!this.sessionId) return
    try {
      await fetch(this.url, {
        method: "DELETE",
        headers: { "Mcp-Session-Id": this.sessionId },
        cache: "no-store",
      })
    } catch {
      // Ignore — session cleanup is best-effort
    }
  }
}

// ─── Convenience: full execute flow ──────────────────────────────────────────

export async function executeToolOnRemote(
  remoteUrl: string,
  toolName: string,
  toolArguments: Record<string, unknown>
): Promise<{ result: ToolCallResult; sessionId?: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const session = new MCPSession(remoteUrl)
  try {
    await session.initialize(controller.signal)
    const result = await session.callTool(
      { name: toolName, arguments: toolArguments },
      controller.signal
    )
    return { result }
  } finally {
    clearTimeout(timer)
    session.terminate() // best-effort cleanup
  }
}

// ─── Convenience: fetch tools list ───────────────────────────────────────────

export async function fetchToolsFromRemote(
  remoteUrl: string
): Promise<ToolsListResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const session = new MCPSession(remoteUrl)
  try {
    await session.initialize(controller.signal)
    return await session.listTools(controller.signal)
  } finally {
    clearTimeout(timer)
    session.terminate()
  }
}
