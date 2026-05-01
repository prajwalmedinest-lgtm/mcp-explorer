"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import type { NormalizedServer } from "@/lib/registry"

const CAT_GRAD: Record<string, { from: string; to: string }> = {
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

function FeaturedCard({ server, index }: { server: NormalizedServer; index: number }) {
  const g = CAT_GRAD[server.category] ?? CAT_GRAD["Other"]
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/server/${server.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl border border-white/[0.07] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl transition-all duration-250 hover:border-white/[0.13] hover:-translate-y-0.5 hover:bg-[oklch(0.135_0.022_278/78%)]">
          {/* Top shimmer */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${g.from}80, ${g.to}80, transparent)` }}
          />

          <div className="flex items-start gap-3 mb-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
            >
              {server.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-white/85 group-hover:text-white/95 transition-colors truncate">
                {server.displayName}
              </h3>
              <p className="text-[10px] text-white/30 mt-0.5 font-mono truncate">{server.name}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>

          <p className="text-[12px] text-white/42 leading-relaxed line-clamp-2 mb-4">
            {server.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <span
              className="text-[10px] font-medium rounded-md px-2 py-0.5 border"
              style={{ background: `${g.from}15`, borderColor: `${g.from}28`, color: `${g.from}bb` }}
            >
              {server.category}
            </span>
            {server.hasRemote && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400/65">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/65" />
                Remote
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[oklch(0.115_0.02_278/72%)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-xl bg-white/[0.05] shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 rounded bg-white/[0.05] shimmer" />
          <div className="h-2 w-20 rounded bg-white/[0.04] shimmer" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-2.5 w-full rounded bg-white/[0.04] shimmer" />
        <div className="h-2.5 w-3/4 rounded bg-white/[0.04] shimmer" />
      </div>
      <div className="h-px w-full bg-white/[0.05] mb-3" />
      <div className="h-4 w-20 rounded bg-white/[0.04] shimmer" />
    </div>
  )
}

export function FeaturedServers() {
  const [servers, setServers] = useState<NormalizedServer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/servers?sort=newest&limit=6")
      .then(r => r.json())
      .then(d => { setServers(d.servers ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-white/45 backdrop-blur-sm mb-5">
            <Sparkles className="h-3 w-3 text-violet-400/80" />
            From the Registry
          </div>
          <h2 className="text-heading text-white/92 mb-3">Recently Added Servers</h2>
          <p className="text-[14px] text-white/42 max-w-md mx-auto">
            The latest MCP servers published to the official registry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : servers.map((s, i) => <FeaturedCard key={s.id} server={s} index={i} />)}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 text-[13px] font-medium text-white/55 hover:text-white/85 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
          >
            Browse all servers
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
