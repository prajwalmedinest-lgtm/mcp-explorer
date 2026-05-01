"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { MeshBackground } from "@/components/mesh-background"
import { Footer } from "@/components/footer"
import { PlaygroundInterface } from "@/components/playground-interface"

export default function PlaygroundPage() {
  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className="text-display text-white/92 mb-3">MCP Playground</h1>
            <p className="text-[15px] text-white/42 max-w-xl leading-relaxed">
              Test MCP tools interactively with custom parameters and see live responses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <PlaygroundInterface />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
