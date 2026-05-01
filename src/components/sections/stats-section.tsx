"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Server, FolderTree, Wifi, Package } from "lucide-react"

interface Stats {
  totalServers: number
  totalCategories: number
  remoteCount: number
  packageCount: number
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/servers?limit=1000")
      .then(r => r.json())
      .then(data => {
        const servers = data.servers ?? []
        setStats({
          totalServers:    data.total ?? servers.length,
          totalCategories: 10,
          remoteCount:     servers.filter((s: { hasRemote: boolean }) => s.hasRemote).length,
          packageCount:    servers.filter((s: { hasPackage: boolean }) => s.hasPackage).length,
        })
      })
      .catch(() => {})
  }, [])

  const items = [
    { icon: Server,     label: "MCP Servers",    value: stats?.totalServers,    grad: "from-[oklch(0.62_0.16_278)] to-[oklch(0.60_0.14_198)]" },
    { icon: FolderTree, label: "Categories",      value: stats?.totalCategories, grad: "from-[oklch(0.60_0.14_198)] to-[oklch(0.64_0.13_158)]" },
    { icon: Wifi,       label: "Remote Servers",  value: stats?.remoteCount,     grad: "from-[oklch(0.64_0.13_158)] to-[oklch(0.66_0.12_32)]"  },
    { icon: Package,    label: "With Packages",   value: stats?.packageCount,    grad: "from-[oklch(0.66_0.12_32)]  to-[oklch(0.62_0.16_278)]" },
  ]

  return (
    <section className="relative py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-white/[0.07] bg-[oklch(0.115_0.02_278/72%)] p-5 backdrop-blur-xl hover:border-white/[0.12] transition-all duration-250"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.grad} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
              <div className="relative">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.grad} mb-4`}>
                  <item.icon className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="text-2xl font-bold text-white/92 mb-0.5 tabular-nums tracking-tight">
                  {item.value === undefined ? (
                    <span className="inline-block h-7 w-14 rounded-lg bg-white/[0.05] shimmer" />
                  ) : (
                    item.value.toLocaleString()
                  )}
                </div>
                <div className="text-[12px] text-white/38">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
