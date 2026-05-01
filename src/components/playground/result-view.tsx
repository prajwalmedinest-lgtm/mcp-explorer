"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Clock, Server, Copy, Check } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ExecutionResult, ToolCallContent } from "@/lib/playground/types"

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex items-center gap-1 rounded border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[10px] text-white/35 hover:text-white/65 transition-all"
    >
      {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

// ─── Content block ────────────────────────────────────────────────────────────

function ContentBlock({ item }: { item: ToolCallContent }) {
  if (item.type === "text" && item.text) {
    // Try to pretty-print JSON
    let display = item.text
    try {
      const parsed = JSON.parse(item.text)
      display = JSON.stringify(parsed, null, 2)
    } catch {
      // Not JSON — show as-is
    }

    return (
      <div className="relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyBtn text={item.text} />
        </div>
        <pre className="code-block text-[11px] text-white/72 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
          {display}
        </pre>
      </div>
    )
  }

  if (item.type === "image" && item.data) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:${item.mimeType ?? "image/png"};base64,${item.data}`}
        alt="Tool result"
        className="max-w-full rounded-lg border border-white/[0.08]"
      />
    )
  }

  if (item.type === "resource") {
    return (
      <pre className="code-block text-[11px] text-white/65 overflow-x-auto">
        {JSON.stringify(item.resource, null, 2)}
      </pre>
    )
  }

  return (
    <pre className="code-block text-[11px] text-white/50 overflow-x-auto">
      {JSON.stringify(item, null, 2)}
    </pre>
  )
}

// ─── Main result view ─────────────────────────────────────────────────────────

interface ResultViewProps {
  result: ExecutionResult
}

export function ResultView({ result }: ResultViewProps) {
  const isSuccess = result.ok && !result.isError
  const isToolError = !result.ok && result.isError
  const isExecError = !result.ok && !result.isError

  const ERROR_MESSAGES: Record<string, string> = {
    no_remote:
      "This server does not expose a remote HTTP endpoint. It must be installed and run locally. See the GitHub repository for setup instructions.",
    timeout:
      "The server did not respond within 15 seconds. It may be temporarily unavailable or under load.",
    unreachable:
      "Could not connect to the remote server. The endpoint may be offline or the URL may have changed.",
    server_error:
      "The server returned an HTTP error. It may require authentication or the endpoint may have moved.",
    execution_failed:
      "The tool call failed. Check that your parameters match the tool's input schema.",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80 shrink-0" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-red-400/80 shrink-0" />
          )}
          <h3 className={cn(
            "text-[11px] font-semibold uppercase tracking-wider",
            isSuccess ? "text-emerald-400/80" : "text-red-400/80"
          )}>
            {isSuccess ? "Success" : isToolError ? "Tool Error" : "Execution Failed"}
          </h3>
          <span className="text-[10px] font-mono text-white/28">
            {result.tool}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-white/28">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {result.durationMs}ms
          </span>
          <span className="flex items-center gap-1">
            <Server className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{result.serverName}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="max-h-[400px]">
        <div className="p-4 space-y-3">
          {/* Error explanation */}
          {isExecError && result.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
              <p className="text-[12px] text-red-400/80 leading-relaxed">
                {ERROR_MESSAGES[result.error] ?? result.error}
              </p>
            </div>
          )}

          {/* Tool content */}
          {result.content && result.content.length > 0 && (
            <div className="space-y-3">
              {result.content.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border p-3",
                    result.isError
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-white/[0.06] bg-white/[0.02]"
                  )}
                >
                  <ContentBlock item={item} />
                </div>
              ))}
            </div>
          )}

          {/* Raw request (collapsible) */}
          <details className="group">
            <summary className="cursor-pointer text-[10px] text-white/28 hover:text-white/50 transition-colors select-none list-none flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Raw request
            </summary>
            <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 relative group/copy">
              <div className="absolute top-2 right-2 opacity-0 group-hover/copy:opacity-100 transition-opacity">
                <CopyBtn text={JSON.stringify(result.request, null, 2)} />
              </div>
              <pre className="code-block text-[10px] text-white/45 overflow-x-auto">
                {JSON.stringify(result.request, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </ScrollArea>
    </motion.div>
  )
}
