"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play, Loader2, Code2, Info, AlertCircle,
  ChevronDown, RefreshCw, Wifi, WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ParamForm } from "@/components/playground/param-form"
import { ResultView } from "@/components/playground/result-view"
import type { NormalizedServer } from "@/lib/registry"
import type { MCPTool, ExecutionResult } from "@/lib/playground/types"

// ─── Notice banner ────────────────────────────────────────────────────────────

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-sky-500/20 bg-sky-500/8 px-4 py-3">
      <Info className="h-3.5 w-3.5 shrink-0 text-sky-400/80 mt-0.5" />
      <div className="text-[11px] text-sky-400/75 leading-relaxed">{children}</div>
    </div>
  )
}

function WarnBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400/80 mt-0.5" />
      <div className="text-[11px] text-amber-400/75 leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Tool selector ────────────────────────────────────────────────────────────

interface ToolSelectorProps {
  tools: MCPTool[]
  selected: MCPTool | null
  onSelect: (t: MCPTool) => void
}

function ToolSelector({ tools, selected, onSelect }: ToolSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] px-4 py-3 text-left transition-all hover:border-white/[0.14]"
      >
        <div className="min-w-0">
          {selected ? (
            <>
              <p className="text-[13px] font-mono font-semibold text-white/88 truncate">
                {selected.name}
              </p>
              {selected.description && (
                <p className="text-[11px] text-white/40 mt-0.5 truncate">
                  {selected.description}
                </p>
              )}
            </>
          ) : (
            <p className="text-[13px] text-white/35">Select a tool…</p>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-white/30 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-x-0 top-full mt-1.5 z-50 rounded-xl border border-white/[0.1] bg-[oklch(0.12_0.02_278)] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            <ScrollArea className="max-h-[280px]">
              <div className="p-1.5">
                {tools.map(tool => (
                  <button
                    key={tool.name}
                    onClick={() => { onSelect(tool); setOpen(false) }}
                    className={cn(
                      "w-full text-left rounded-lg px-3 py-2.5 mb-0.5 transition-all",
                      selected?.name === tool.name
                        ? "bg-gradient-to-r from-[oklch(0.52_0.19_278)] to-[oklch(0.50_0.17_198)] text-white"
                        : "text-white/55 hover:text-white/85 hover:bg-white/[0.05]"
                    )}
                  >
                    <p className="text-[12px] font-mono font-medium">{tool.name}</p>
                    {tool.description && (
                      <p className="text-[10px] opacity-60 mt-0.5 line-clamp-2">{tool.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PlaygroundInterface() {
  // Server list
  const [servers, setServers] = useState<NormalizedServer[]>([])
  const [loadingServers, setLoadingServers] = useState(true)
  const [selectedServer, setSelectedServer] = useState<NormalizedServer | null>(null)

  // Tools for selected server
  const [tools, setTools] = useState<MCPTool[]>([])
  const [loadingTools, setLoadingTools] = useState(false)
  const [toolsError, setToolsError] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null)

  // Parameters
  const [toolArgs, setToolArgs] = useState<Record<string, unknown>>({})

  // Execution
  const [executing, setExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)

  // ── Load server list ──────────────────────────────────────────────────────

  useEffect(() => {
    const ctrl = new AbortController()
    fetch("/api/servers?sort=name&limit=200", { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => {
        const list: NormalizedServer[] = (data.servers ?? []).filter(
          (s: NormalizedServer) => s.hasRemote
        )
        setServers(list)
        if (list.length > 0) setSelectedServer(list[0])
        setLoadingServers(false)
      })
      .catch(err => {
        if (err.name !== "AbortError") setLoadingServers(false)
      })
    return () => ctrl.abort()
  }, [])

  // ── Load tools when server changes ───────────────────────────────────────

  const loadTools = useCallback(async (server: NormalizedServer) => {
    setTools([])
    setSelectedTool(null)
    setToolArgs({})
    setResult(null)
    setToolsError(null)
    setLoadingTools(true)

    try {
      const res = await fetch(
        `/api/playground/tools?serverSlug=${encodeURIComponent(server.slug)}`
      )
      const data = await res.json()

      if (!res.ok) {
        if (data.error === "no_remote") {
          setToolsError("no_remote")
        } else {
          setToolsError(data.message ?? data.error ?? "Failed to load tools")
        }
        setLoadingTools(false)
        return
      }

      const toolList: MCPTool[] = data.tools ?? []
      setTools(toolList)
      if (toolList.length > 0) setSelectedTool(toolList[0])
    } catch (err) {
      setToolsError(err instanceof Error ? err.message : "Network error")
    } finally {
      setLoadingTools(false)
    }
  }, [])

  useEffect(() => {
    if (selectedServer) loadTools(selectedServer)
  }, [selectedServer, loadTools])

  // Reset args when tool changes
  useEffect(() => {
    setToolArgs({})
    setResult(null)
  }, [selectedTool])

  // ── Execute ───────────────────────────────────────────────────────────────

  const handleExecute = async () => {
    if (!selectedServer || !selectedTool) return
    setExecuting(true)
    setResult(null)

    try {
      const res = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverSlug: selectedServer.slug,
          toolName: selectedTool.name,
          arguments: toolArgs,
        }),
      })

      const data: ExecutionResult = await res.json()
      setResult(data)
    } catch (err) {
      setResult({
        ok: false,
        status: "error",
        durationMs: 0,
        tool: selectedTool.name,
        serverName: selectedServer.name,
        remoteUrl: selectedServer.remoteUrls[0] ?? "",
        request: {
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: selectedTool.name, arguments: toolArgs },
        },
        error: err instanceof Error ? err.message : "Network error",
      })
    } finally {
      setExecuting(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loadingServers) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-2.5 text-[13px] text-white/35">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading servers from registry…
        </div>
      </div>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <WifiOff className="h-12 w-12 text-white/15 mb-4" />
        <h3 className="text-[14px] font-semibold text-white/55 mb-2">
          No remote servers available
        </h3>
        <p className="text-[12px] text-white/32 max-w-xs">
          The playground only supports servers with remote HTTP endpoints.
          No such servers were found in the registry right now.
        </p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-5 items-start">

      {/* ── Left sidebar: server list ── */}
      <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] backdrop-blur-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-white/65 uppercase tracking-wider">
            Remote Servers
          </h3>
          <span className="text-[10px] text-white/28 tabular-nums">
            {servers.length}
          </span>
        </div>
        <ScrollArea className="h-[520px]">
          <div className="p-2">
            {servers.map(server => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 mb-0.5 transition-all",
                  selectedServer?.id === server.id
                    ? "bg-gradient-to-r from-[oklch(0.52_0.19_278)] to-[oklch(0.50_0.17_198)] text-white"
                    : "text-white/52 hover:text-white/80 hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Wifi className="h-2.5 w-2.5 text-emerald-400/70 shrink-0" />
                  <p className="text-[12px] font-medium truncate">{server.displayName}</p>
                </div>
                <p className="text-[10px] opacity-45 font-mono truncate pl-4">
                  {server.name}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ── Right: main panel ── */}
      <div className="space-y-4 min-w-0">

        {selectedServer ? (
          <>
            {/* Server header */}
            <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)]">
                  <Code2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] font-semibold text-white/88 truncate">
                    {selectedServer.displayName}
                  </h2>
                  <p className="text-[10px] text-white/35 mt-0.5 font-mono truncate">
                    {selectedServer.name}
                  </p>
                  {selectedServer.description && (
                    <p className="text-[12px] text-white/42 mt-1.5 leading-relaxed line-clamp-2">
                      {selectedServer.description}
                    </p>
                  )}
                </div>
              </div>

              {selectedServer.remoteUrls[0] && (
                <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                  <p className="text-[9px] text-white/28 uppercase tracking-wider font-semibold mb-0.5">
                    Endpoint
                  </p>
                  <code className="text-[11px] text-emerald-400/80 font-mono break-all">
                    {selectedServer.remoteUrls[0]}
                  </code>
                </div>
              )}
            </div>

            {/* Tools loading */}
            {loadingTools && (
              <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-6 backdrop-blur-xl flex items-center gap-2.5 text-[12px] text-white/35">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting to server and fetching tools…
              </div>
            )}

            {/* Tools error */}
            {!loadingTools && toolsError && (
              <div className="space-y-3">
                {toolsError === "no_remote" ? (
                  <WarnBanner>
                    This server does not expose a remote HTTP endpoint.
                    It must be installed and run locally.{" "}
                    {selectedServer.githubUrl && (
                      <a
                        href={selectedServer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-amber-400 transition-colors"
                      >
                        View setup instructions on GitHub ↗
                      </a>
                    )}
                  </WarnBanner>
                ) : (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400/80 mt-0.5" />
                      <div>
                        <p className="text-[12px] font-medium text-red-400/90 mb-1">
                          Could not load tools
                        </p>
                        <p className="text-[11px] text-red-400/60 leading-relaxed">
                          {toolsError}
                        </p>
                        <button
                          onClick={() => loadTools(selectedServer)}
                          className="mt-2.5 flex items-center gap-1.5 text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tool selector + params + execute */}
            {!loadingTools && !toolsError && tools.length > 0 && (
              <>
                {/* Tool selector */}
                <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-4 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold text-white/55 uppercase tracking-wider mb-3">
                    Tool — {tools.length} available
                  </p>
                  <ToolSelector
                    tools={tools}
                    selected={selectedTool}
                    onSelect={t => { setSelectedTool(t); setResult(null) }}
                  />
                </div>

                {/* Parameters */}
                {selectedTool && (
                  <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] backdrop-blur-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
                      <div>
                        <h3 className="text-[11px] font-semibold text-white/65 uppercase tracking-wider">
                          Parameters
                        </h3>
                        {selectedTool.description && (
                          <p className="text-[11px] text-white/38 mt-0.5">
                            {selectedTool.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleExecute}
                        disabled={executing}
                        size="sm"
                        className="h-8 px-4 text-[12px] font-semibold bg-gradient-to-r from-[oklch(0.52_0.19_278)] to-[oklch(0.50_0.17_198)] text-white hover:brightness-110 border-0 shrink-0"
                      >
                        {executing ? (
                          <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />Executing…</>
                        ) : (
                          <><Play className="h-3 w-3 mr-1.5" />Execute</>
                        )}
                      </Button>
                    </div>
                    <div className="p-4">
                      <ParamForm
                        schema={selectedTool.inputSchema}
                        onChange={setToolArgs}
                      />
                    </div>
                  </div>
                )}

                {/* Info: what happens when you execute */}
                {selectedTool && !result && !executing && (
                  <InfoBanner>
                    Clicking <strong>Execute</strong> sends a real{" "}
                    <code className="font-mono">tools/call</code> JSON-RPC request
                    to <strong>{selectedServer.remoteUrls[0]}</strong> via a secure
                    server-side proxy. No credentials are required for public servers.
                  </InfoBanner>
                )}
              </>
            )}

            {/* No tools */}
            {!loadingTools && !toolsError && tools.length === 0 && (
              <WarnBanner>
                This server responded but reported no available tools.
              </WarnBanner>
            )}

            {/* Result */}
            <AnimatePresence>
              {result && <ResultView result={result} />}
            </AnimatePresence>

            {/* Server links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedServer.githubUrl && (
                <a
                  href={selectedServer.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/45 hover:text-white/75 hover:bg-white/[0.07] transition-all"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {selectedServer.websiteUrl && (
                <a
                  href={selectedServer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/45 hover:text-white/75 hover:bg-white/[0.07] transition-all"
                >
                  Website
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-16 backdrop-blur-xl text-center">
            <Code2 className="h-12 w-12 text-white/15 mx-auto mb-4" />
            <h3 className="text-[14px] font-semibold text-white/55 mb-2">
              Select a server to begin
            </h3>
            <p className="text-[12px] text-white/32">
              Choose a remote server from the sidebar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
