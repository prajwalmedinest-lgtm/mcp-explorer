"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

const PREVIEW_ITEMS = [
  { label: "AI & Agents",      icon: "🤖", desc: "LLMs, embeddings, reasoning",   gradient: "from-[#6366f1] to-[#06b6d4]" },
  { label: "Developer Tools",  icon: "🛠",  desc: "GitHub, CI/CD, code search",    gradient: "from-[#8b5cf6] to-[#6366f1]" },
  { label: "Data & Analytics", icon: "📊", desc: "Databases, warehouses, queries", gradient: "from-[#0ea5e9] to-[#6366f1]" },
]

const ease = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center px-4 sm:px-6 pt-28 pb-16">
      <div className="max-w-4xl mx-auto text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-white/50 backdrop-blur-sm mb-10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          Official MCP Registry — Live Data
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="text-display text-white/95 mb-5"
        >
          Discover{" "}
          <span className="gradient-text">MCP Servers</span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease }}
          className="text-[1.0625rem] text-white/45 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Browse, inspect, and connect to public MCP servers from the official registry.
          Real-time data. Every server. One place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/explore"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)] px-5 py-3 text-[13px] font-semibold text-white shadow-lg shadow-[oklch(0.58_0.18_278)/25%] hover:shadow-xl hover:shadow-[oklch(0.58_0.18_278)/35%] hover:brightness-110 transition-all duration-200"
          >
            <Search className="h-3.5 w-3.5" />
            Browse Servers
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/playground"
            className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[13px] font-semibold text-white/65 hover:text-white/90 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200 backdrop-blur-sm"
          >
            Try Playground
          </Link>
        </motion.div>

        {/* Category preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {PREVIEW_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.08, ease }}
              >
                <Link
                  href={`/explore?category=${encodeURIComponent(item.label)}`}
                  className="group block rounded-xl border border-white/[0.07] bg-[oklch(0.115_0.02_278/70%)] p-4 backdrop-blur-xl hover:border-white/[0.13] hover:-translate-y-0.5 hover:bg-[oklch(0.135_0.022_278/75%)] transition-all duration-250"
                >
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${item.gradient} mb-3 flex items-center justify-center text-base`}>
                    {item.icon}
                  </div>
                  <h3 className="text-[13px] font-semibold text-white/80 group-hover:text-white/95 transition-colors mb-0.5">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-white/35">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
