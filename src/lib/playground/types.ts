// ─── MCP JSON-RPC wire types ──────────────────────────────────────────────────

export interface JsonRpcRequest {
  jsonrpc: "2.0"
  id: number | string
  method: string
  params?: unknown
}

export interface JsonRpcResponse {
  jsonrpc: "2.0"
  id: number | string | null
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

// ─── MCP initialize ───────────────────────────────────────────────────────────

export interface InitializeParams {
  protocolVersion: string
  capabilities: Record<string, unknown>
  clientInfo: { name: string; version: string }
}

export interface InitializeResult {
  protocolVersion: string
  capabilities: {
    tools?: { listChanged?: boolean }
    resources?: unknown
    prompts?: unknown
  }
  serverInfo: { name: string; version: string }
}

// ─── MCP tools/list ───────────────────────────────────────────────────────────

export interface ToolInputSchema {
  type: "object"
  properties?: Record<string, ToolProperty>
  required?: string[]
  additionalProperties?: boolean
}

export interface ToolProperty {
  type: string
  description?: string
  enum?: string[]
  default?: unknown
  items?: ToolProperty
  properties?: Record<string, ToolProperty>
  required?: string[]
}

export interface MCPTool {
  name: string
  description?: string
  inputSchema: ToolInputSchema
}

export interface ToolsListResult {
  tools: MCPTool[]
  nextCursor?: string
}

// ─── MCP tools/call ───────────────────────────────────────────────────────────

export interface ToolCallParams {
  name: string
  arguments?: Record<string, unknown>
}

export interface ToolCallContent {
  type: "text" | "image" | "resource"
  text?: string
  data?: string
  mimeType?: string
  resource?: unknown
}

export interface ToolCallResult {
  content: ToolCallContent[]
  isError?: boolean
}

// ─── Playground execution types ───────────────────────────────────────────────

export type ExecutionStatus =
  | "idle"
  | "connecting"
  | "listing-tools"
  | "executing"
  | "success"
  | "error"

export interface ExecutionResult {
  ok: boolean
  status: ExecutionStatus
  durationMs: number
  tool: string
  serverName: string
  remoteUrl: string
  request: JsonRpcRequest
  response?: JsonRpcResponse
  content?: ToolCallContent[]
  error?: string
  isError?: boolean // tool returned isError: true
}

export interface ToolsCache {
  serverName: string
  remoteUrl: string
  tools: MCPTool[]
  fetchedAt: number
}
