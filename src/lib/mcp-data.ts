/**
 * mcp-data.ts
 *
 * This file previously contained mock/fake server data.
 * It has been replaced with real registry data via src/lib/registry/.
 *
 * The playground still needs a typed server list for its UI.
 * We re-export the NormalizedServer type and provide a thin
 * compatibility shim so playground-interface.tsx can work with
 * real data fetched at runtime.
 */

export type { NormalizedServer as MCPServer } from "@/lib/registry/types"

// Kept for backward-compat imports that reference MCPTool shape
export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, { type: string; description: string }>
    required?: string[]
  }
}

// Empty — real data comes from the registry API
export const ALL_SERVERS: never[] = []
