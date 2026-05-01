"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FlaskConical, ArrowRight, Code2, Zap } from "lucide-react"

export function PlaygroundPreview() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl border border-white/[0.08] bg-[oklch(0.115_0.02_278/75%)] p-8 sm:p-12 backdrop-blur-xl overflow-hidden"
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[oklch(0.62_0.16_278/10%)] to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[oklch(0.60_0.14_198/10%)] to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Icon */}
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)] mb-6 shadow-lg shadow-[oklch(0.58_0.18_278)/20%]">
              <FlaskConical className="h-6 w-6 text-white" strokeWidth={2} />
            </div>

            {/* Content */}
            <h2 className="text-heading text-white/92 mb-3">
              Test MCP Tools in Real-Time
            </h2>
            <p className="text-[14px] text-white/45 mb-8 max-w-lg leading-relaxed">
              Use our interactive playground to test any MCP tool with custom parameters
              and see live responses. Perfect for exploring capabilities before integration.
            </p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <Code2 className="h-3.5 w-3.5 text-[oklch(0.70_0.12_198)]" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white/85 mb-0.5">JSON Editor</h3>
                  <p className="text-[11px] text-white/38">Edit request parameters with syntax highlighting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <Zap className="h-3.5 w-3.5 text-[oklch(0.66_0.12_32)]" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white/85 mb-0.5">Live Responses</h3>
                  <p className="text-[11px] text-white/38">See formatted results instantly</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/playground"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-5 py-2.5 text-[13px] font-semibold text-white/75 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.18] transition-all duration-200"
            >
              Open Playground
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
