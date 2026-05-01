"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GitBranch, Globe, Copy, Check, ArrowLeft, ExternalLink, Wifi, Package, Tag, Calendar, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NormalizedServer } from "@/lib/registry"

const CAT_COLORS: Record<string, { from: string; to: string }> = {
  "AI & Agents":      { from: "#6366f1", to: "#06b6d4" },
  "Developer Tools":  { from: "#8b5cf6", to: "#6366f1" },
  "Data & Analytics": { from: "#0ea5e9", to: "#6366f1" },
  "Productivity":     { from: "#8b5cf6", to: "#ec4899" },
  "Search":           { from: "#10b981", to: "#06b6d4" },
  "Communication":    { from: "#f59e0b", to: "#ec4899" },
  "Finance":          { from: "#10b981", to: "#6366f1" },
  "Security":         { from: "#ef4444", to: "#8b5cf6" },
  "Infrastructure":   { from: "#0ea5e9", to: "#8b5cf6" },
  "Other":            { from: "#6366f1", to: "#06b6d4" },
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="h-6 px-2 text-[11px] text-white/40 hover:text-white/75 hover:bg-white/[0.07] gap-1"
    >
      {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
        <Icon className="h-3 w-3 text-white/35" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/30 mb-0.5">{label}</p>
        <div className="text-[12px] text-white/75">{children}</div>
      </div>
    </div>
  )
}

export function ServerDetailContent({ server }: { server: NormalizedServer }) {
  const g = CAT_COLORS[server.category] ?? CAT_COLORS["Other"]

  const connectCommand = server.remoteUrls[0]
    ? `npx @modelcontextprotocol/inspector ${server.remoteUrls[0]}`
    : server.githubUrl
    ? `# Clone and follow instructions at:\n# ${server.githubUrl}`
    : `# See ${server.websiteUrl ?? "the server documentation"} for setup instructions`

  const fmt = (iso: string) => iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-[12px] text-white/38 hover:text-white/70 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Explore
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} className="mb-8">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white text-xl font-bold"
            style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: `0 16px 32px -8px ${g.from}40` }}
          >
            {server.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-white/92 leading-tight tracking-tight">
                {server.displayName}
              </h1>
              {server.hasRemote && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/22 bg-emerald-500/12 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                  Remote
                </span>
              )}
            </div>
            <p className="text-[14px] text-white/48 leading-relaxed mb-4 max-w-2xl">
              {server.description || "No description provided."}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="border-white/[0.09] text-white/40 font-mono text-[10px] px-2 py-0.5">
                v{server.version}
              </Badge>
              <Badge variant="outline" className="border-white/[0.09] text-[10px] px-2 py-0.5"
                style={{ color: `${g.from}bb`, borderColor: `${g.from}28` }}>
                {server.category}
              </Badge>
              {server.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="outline" className="border-white/[0.07] text-white/32 text-[10px] bg-white/[0.03] px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Connect command */}
        <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.018_278)] p-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-label text-white/35">
              {server.hasRemote ? "Connect" : "Install"}
            </span>
            <CopyBtn text={connectCommand} />
          </div>
          <pre className="code-block text-[13px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
            {connectCommand}
          </pre>
        </div>
      </motion.div>

      {/* Two-column */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {server.remoteUrls.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
              <h2 className="text-[12px] font-semibold text-white/72 mb-3.5 flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5 text-emerald-400/80" />
                Remote Endpoints
              </h2>
              <div className="space-y-2">
                {server.remoteUrls.map((url, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <code className="text-[11px] text-white/65 font-mono truncate flex-1">{url}</code>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CopyBtn text={url} />
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-white/32 hover:text-white/60 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
            <h2 className="text-[12px] font-semibold text-white/72 mb-3">About</h2>
            <p className="text-[13px] text-white/50 leading-relaxed">
              {server.description || "No description available for this server."}
            </p>
          </div>

          {server.tags.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
              <h2 className="text-[12px] font-semibold text-white/72 mb-3 flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-white/35" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {server.tags.map(tag => (
                  <span key={tag} className="rounded border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
            <h2 className="text-[12px] font-semibold text-white/72 mb-3">Registry Name</h2>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
              <code className="text-[11px] text-white/65 font-mono">{server.name}</code>
              <CopyBtn text={server.name} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
            <h2 className="text-[12px] font-semibold text-white/72 mb-3">Links</h2>
            <div className="space-y-1.5">
              {server.githubUrl && (
                <a href={server.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-[12px] text-white/55 hover:text-white/85 hover:bg-white/[0.07] transition-all">
                  <GitBranch className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">View on GitHub</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-white/25" />
                </a>
              )}
              {server.websiteUrl && (
                <a href={server.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-[12px] text-white/55 hover:text-white/85 hover:bg-white/[0.07] transition-all">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">Website</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-white/25" />
                </a>
              )}
              {!server.githubUrl && !server.websiteUrl && (
                <p className="text-[11px] text-white/28 py-1">No links available</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl">
            <h2 className="text-[12px] font-semibold text-white/72 mb-1">Details</h2>
            <InfoRow icon={Package} label="Version"><span className="font-mono">{server.version}</span></InfoRow>
            <InfoRow icon={Tag} label="Category">{server.category}</InfoRow>
            {server.hasRemote && <InfoRow icon={Wifi} label="Transport">Streamable HTTP / SSE</InfoRow>}
            {server.publishedAt && <InfoRow icon={Calendar} label="Published">{fmt(server.publishedAt)}</InfoRow>}
            {server.updatedAt && <InfoRow icon={RefreshCw} label="Updated">{fmt(server.updatedAt)}</InfoRow>}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/72%)] p-4 backdrop-blur-xl">
            <p className="text-[11px] text-white/28 leading-relaxed">
              Listed on the{" "}
              <a href="https://registry.modelcontextprotocol.io" target="_blank" rel="noopener noreferrer"
                className="text-white/45 hover:text-white/72 underline underline-offset-2 transition-colors">
                official MCP Registry
              </a>
              . Data refreshed every 5 minutes.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
