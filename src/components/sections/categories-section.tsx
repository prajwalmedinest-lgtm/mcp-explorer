"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ALL_CATEGORIES } from "@/lib/registry"

const ICONS: Record<string, string> = {
  "AI & Agents":      "🤖",
  "Developer Tools":  "🛠",
  "Data & Analytics": "📊",
  "Productivity":     "📋",
  "Search":           "🔍",
  "Communication":    "💬",
  "Finance":          "💰",
  "Security":         "🔒",
  "Infrastructure":   "☁️",
  "Other":            "📦",
}

export function CategoriesSection() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch("/api/servers?limit=1000")
      .then(r => r.json())
      .then(data => {
        const c: Record<string, number> = {}
        ;(data.servers ?? []).forEach((s: { category: string }) => {
          c[s.category] = (c[s.category] ?? 0) + 1
        })
        setCounts(c)
      })
      .catch(() => {})
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
          <h2 className="text-heading text-white/92 mb-3">Browse by Category</h2>
          <p className="text-[14px] text-white/42 max-w-md mx-auto">
            Find the perfect MCP server for your use case
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_CATEGORIES.map((cat, i) => {
            const count = counts[cat] ?? 0
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.04 }}
              >
                <Link
                  href={`/explore?category=${encodeURIComponent(cat)}`}
                  className="group block rounded-xl border border-white/[0.07] bg-[oklch(0.115_0.02_278/70%)] p-4 backdrop-blur-xl hover:border-white/[0.13] hover:bg-[oklch(0.135_0.022_278/75%)] transition-all duration-250"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{ICONS[cat] ?? "📦"}</span>
                      <h3 className="text-[12px] font-semibold text-white/80 group-hover:text-white/95 transition-colors leading-tight">
                        {cat}
                      </h3>
                    </div>
                    <ArrowRight className="h-3 w-3 text-white/18 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-[11px] text-white/32">
                    {count > 0 ? `${count} server${count === 1 ? "" : "s"}` : "—"}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
