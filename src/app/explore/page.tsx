"use client"

import Link from "next/link"
import { useState, useMemo, Suspense, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, ArrowDownAZ, Clock, TrendingUp, X, Zap, Loader2, AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { MeshBackground } from "@/components/mesh-background"
import { Footer } from "@/components/footer"
import { useServers } from "@/hooks/use-servers"
import { ALL_CATEGORIES, countByCategory } from "@/lib/registry"
import type { ServerCategory, SearchOptions, NormalizedServer } from "@/lib/registry"
import { cn } from "@/lib/utils"

const CAT_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  "AI & Agents":      { from: "#6366f1", to: "#06b6d4", glow: "rgba(99,102,241,0.18)"  },
  "Developer Tools":  { from: "#8b5cf6", to: "#6366f1", glow: "rgba(139,92,246,0.18)"  },
  "Data & Analytics": { from: "#0ea5e9", to: "#6366f1", glow: "rgba(14,165,233,0.18)"  },
  "Productivity":     { from: "#8b5cf6", to: "#ec4899", glow: "rgba(139,92,246,0.18)"  },
  "Search":           { from: "#10b981", to: "#06b6d4", glow: "rgba(16,185,129,0.18)"  },
  "Communication":    { from: "#f59e0b", to: "#ec4899", glow: "rgba(245,158,11,0.18)"  },
  "Finance":          { from: "#10b981", to: "#6366f1", glow: "rgba(16,185,129,0.18)"  },
  "Security":         { from: "#ef4444", to: "#8b5cf6", glow: "rgba(239,68,68,0.18)"   },
  "Infrastructure":   { from: "#0ea5e9", to: "#8b5cf6", glow: "rgba(14,165,233,0.18)"  },
  "Other":            { from: "#6366f1", to: "#06b6d4", glow: "rgba(99,102,241,0.18)"  },
}

function ServerCard({ server, index }: { server: NormalizedServer; index: number }) {
  const [hovered, setHovered] = useState(false)
  const g = CAT_COLORS[server.category] ?? CAT_COLORS["Other"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.5), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/server/${server.slug}`}
        className="group block h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative h-full rounded-2xl border bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl transition-all duration-250"
          style={{
            borderColor: hovered ? "oklch(1 0 0 / 12%)" : "oklch(1 0 0 / 7%)",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 16px 40px -12px rgba(0,0,0,0.45), 0 0 28px -8px ${g.glow}`
              : "0 2px 16px -4px rgba(0,0,0,0.3)",
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${g.from}70, ${g.to}70, transparent)`,
              opacity: hovered ? 1 : 0,
            }}
          />
          {/* Glow overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${g.glow} 0%, transparent 65%)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                >
                  {server.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-white/85 group-hover:text-white/95 transition-colors leading-tight line-clamp-1">
                    {server.displayName}
                  </h3>
                  <p className="text-[10px] text-white/28 mt-0.5 font-mono truncate max-w-[150px]">
                    {server.name}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-white/28">
                v{server.version}
              </span>
            </div>

            {/* Description */}
            <p className="text-[12px] text-white/45 leading-relaxed line-clamp-2 mb-3.5 min-h-[2.4rem]">
              {server.description || "No description provided."}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {server.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/38"
                >
                  {tag}
                </span>
              ))}
              <span
                className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border"
                style={{ background: `${g.from}14`, borderColor: `${g.from}28`, color: `${g.from}bb` }}
              >
                {server.category}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                {server.hasRemote && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400/65">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/65" />
                    Remote
                  </span>
                )}
                {server.hasPackage && (
                  <span className="text-[10px] text-white/28">Package</span>
                )}
              </div>
              {server.githubUrl && (
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(server.githubUrl!, "_blank", "noopener,noreferrer") }}
                  className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-white/35 hover:text-white/65 hover:border-white/[0.12] transition-all"
                >
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const CAT_ICONS: Record<string, string> = {
  "all": "⚡", "AI & Agents": "🤖", "Developer Tools": "🛠", "Data & Analytics": "📊",
  "Productivity": "📋", "Search": "🔍", "Communication": "💬", "Finance": "💰",
  "Security": "🔒", "Infrastructure": "☁️", "Other": "📦",
}

function FilterPill({ id, label, count, active, onClick }: { id: string; label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium",
        "border transition-all duration-200 whitespace-nowrap select-none",
        active
          ? "border-transparent text-white"
          : "border-white/[0.07] bg-white/[0.03] text-white/45 hover:text-white/72 hover:border-white/[0.12] hover:bg-white/[0.05]"
      )}
    >
      {active && (
        <motion.span
          layoutId="filter-active"
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(135deg, oklch(0.52 0.19 278), oklch(0.50 0.17 198))" }}
          transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
        />
      )}
      <span className="relative z-10 text-sm leading-none">{CAT_ICONS[id] ?? "📦"}</span>
      <span className="relative z-10">{label}</span>
      <span className={cn("relative z-10 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tabular-nums", active ? "bg-white/20 text-white" : "bg-white/[0.06] text-white/32")}>
        {count}
      </span>
    </motion.button>
  )
}

const SORT_OPTS: { value: NonNullable<SearchOptions["sort"]>; label: string; icon: React.ReactNode }[] = [
  { value: "name",   label: "Name A–Z", icon: <ArrowDownAZ className="h-3.5 w-3.5" /> },
  { value: "newest", label: "Newest",   icon: <Clock className="h-3.5 w-3.5" /> },
  { value: "oldest", label: "Oldest",   icon: <TrendingUp className="h-3.5 w-3.5" /> },
]

function SortDropdown({ value, onChange }: { value: NonNullable<SearchOptions["sort"]>; onChange: (v: NonNullable<SearchOptions["sort"]>) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cur = SORT_OPTS.find(o => o.value === value)!

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-white/55 hover:bg-white/[0.07] hover:text-white/80 transition-all"
      >
        {cur.icon}
        <span>{cur.label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-1.5 z-50 w-40 rounded-xl border border-white/[0.09] bg-[oklch(0.12_0.02_278)] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {SORT_OPTS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn("flex w-full items-center gap-2 px-3.5 py-2.5 text-[12px] transition-colors", opt.value === value ? "bg-white/[0.07] text-white" : "text-white/45 hover:bg-white/[0.05] hover:text-white/75")}
              >
                {opt.icon}
                {opt.label}
                {opt.value === value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[oklch(0.115_0.02_278/72%)] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-lg bg-white/[0.05] shimmer" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 rounded bg-white/[0.05] shimmer" />
          <div className="h-2 w-20 rounded bg-white/[0.04] shimmer" />
        </div>
      </div>
      <div className="space-y-1.5 mb-3.5">
        <div className="h-2.5 w-full rounded bg-white/[0.04] shimmer" />
        <div className="h-2.5 w-4/5 rounded bg-white/[0.04] shimmer" />
      </div>
      <div className="flex gap-1.5 mb-3.5">
        <div className="h-4 w-12 rounded bg-white/[0.04] shimmer" />
        <div className="h-4 w-14 rounded bg-white/[0.04] shimmer" />
        <div className="h-4 w-10 rounded bg-white/[0.04] shimmer" />
      </div>
      <div className="h-px w-full bg-white/[0.05] mb-3" />
      <div className="flex justify-between">
        <div className="h-3 w-14 rounded bg-white/[0.04] shimmer" />
        <div className="h-5 w-16 rounded-lg bg-white/[0.04] shimmer" />
      </div>
    </div>
  )
}

function ExploreContent() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get("category") ?? "all") as ServerCategory | "all"

  const [query, setQuery]       = useState("")
  const [category, setCategory] = useState<ServerCategory | "all">(initialCategory)
  const [sort, setSort]         = useState<NonNullable<SearchOptions["sort"]>>("name")
  const [focused, setFocused]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { servers, total, loading, error } = useServers({ query, category, sort })

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); inputRef.current?.focus() }
      if (e.key === "Escape") inputRef.current?.blur()
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [])

  const counts = useMemo(() => countByCategory(servers), [servers])
  const PILLS = [{ id: "all", label: "All" }, ...ALL_CATEGORIES.map(c => ({ id: c, label: c }))]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/45">
            <Zap className="h-3 w-3 text-violet-400/80" />
            Live Registry
          </span>
          {!loading && (
            <span className="text-[11px] text-white/28 tabular-nums">
              {total.toLocaleString()} servers indexed
            </span>
          )}
        </div>
        <h1 className="text-display text-white/92 mb-4">Explore Servers</h1>
        <p className="text-[15px] text-white/42 max-w-lg leading-relaxed">
          Discover production-ready MCP servers from the official registry.
          Connect AI assistants to any tool, API, or data source.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mb-7"
      >
        <div className="relative">
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, oklch(0.52 0.19 278 / 0.45), oklch(0.50 0.17 198 / 0.45))",
              filter: "blur(6px)",
              opacity: focused ? 1 : 0,
            }}
          />
          <div className={cn(
            "relative flex items-center gap-3 rounded-2xl border px-5 py-3.5",
            "bg-[oklch(0.115_0.02_278/80%)] backdrop-blur-2xl transition-all duration-200",
            focused ? "border-white/[0.16] shadow-xl shadow-black/25" : "border-white/[0.07] shadow-md shadow-black/20"
          )}>
            <Search className={cn("h-4.5 w-4.5 shrink-0 transition-colors duration-200", focused ? "text-violet-400/80" : "text-white/22")} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search servers, tools, categories…"
              className="flex-1 bg-transparent text-[14px] text-white/88 placeholder:text-white/22 outline-none caret-violet-400"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => { setQuery(""); inputRef.current?.focus() }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/38 hover:bg-white/[0.12] hover:text-white/65 transition-all"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>
            {!focused && !query && (
              <kbd className="hidden sm:flex items-center rounded border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/22">
                /
              </kbd>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters + sort */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between gap-4 mb-7"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 min-w-0 scrollbar-hide">
          {PILLS.map(p => (
            <FilterPill
              key={p.id}
              id={p.id}
              label={p.label}
              active={category === p.id}
              count={p.id === "all" ? (total || servers.length) : (counts[p.id] ?? 0)}
              onClick={() => setCategory(p.id as ServerCategory | "all")}
            />
          ))}
        </div>
        <div className="shrink-0">
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </motion.div>

      {/* Meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mb-5 flex items-center gap-3"
      >
        {loading ? (
          <span className="flex items-center gap-2 text-[12px] text-white/28">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading registry…
          </span>
        ) : (
          <span className="text-[12px] text-white/32 tabular-nums">
            {servers.length.toLocaleString()} {servers.length === 1 ? "server" : "servers"}
            {(query || category !== "all") ? " matching filters" : ""}
          </span>
        )}
        {(query || category !== "all") && !loading && (
          <button
            onClick={() => { setQuery(""); setCategory("all") }}
            className="text-[11px] text-white/28 hover:text-white/55 underline underline-offset-2 transition-colors"
          >
            Clear
          </button>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex items-start gap-3 rounded-xl border border-red-500/18 bg-red-500/8 p-4"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400/80 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-red-400/90">Failed to load registry</p>
            <p className="text-[11px] text-red-400/55 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </motion.div>
        ) : servers.length > 0 ? (
          <motion.div key={`${category}-${query}-${sort}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {servers.map((s, i) => <ServerCard key={s.id} server={s} index={i} />)}
          </motion.div>
        ) : !error ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              <Search className="h-7 w-7 text-white/18" />
            </div>
            <h3 className="text-[16px] font-semibold text-white/55 mb-2">No servers found</h3>
            <p className="text-[13px] text-white/32 mb-6 max-w-xs">Try a different search term or clear the active filters</p>
            <button
              onClick={() => { setQuery(""); setCategory("all") }}
              className="rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 text-[13px] font-medium text-white/55 hover:bg-white/[0.07] hover:text-white/85 transition-all"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto pt-20 text-center">
            <div className="text-[13px] text-white/28">Loading…</div>
          </div>
        }>
          <ExploreContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
