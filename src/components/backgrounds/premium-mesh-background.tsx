"use client"

import { motion } from "framer-motion"

interface PremiumMeshBackgroundProps {
  variant?: "default" | "subtle" | "vibrant" | "minimal"
  className?: string
}

export function PremiumMeshBackground({
  variant = "default",
  className = "",
}: PremiumMeshBackgroundProps) {
  const opacity = {
    default: 0.13,
    subtle:  0.07,
    vibrant: 0.18,
    minimal: 0.04,
  }[variant]

  const blur = {
    default: "90px",
    subtle:  "110px",
    vibrant: "70px",
    minimal: "130px",
  }[variant]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t: Record<string, any> = { repeat: Infinity, ease: "easeInOut" }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base — deep charcoal with purple undertone */}
      <div className="absolute inset-0 bg-[oklch(0.085_0.018_278)]" />

      {/* Blob 1 — lavender, top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "55vw", height: "55vw",
          maxWidth: 820, maxHeight: 820,
          top: "-22%", left: "-14%",
          background: `radial-gradient(circle, oklch(0.60 0.18 285 / ${opacity}) 0%, transparent 68%)`,
          filter: `blur(${blur})`,
          willChange: "transform",
        }}
        animate={{ x: [0, 48, -28, 0], y: [0, -38, 32, 0], scale: [1, 1.07, 0.96, 1] }}
        transition={{ ...t, duration: 28 }}
      />

      {/* Blob 2 — soft cyan, top-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "48vw", height: "48vw",
          maxWidth: 720, maxHeight: 720,
          top: "-12%", right: "-18%",
          background: `radial-gradient(circle, oklch(0.62 0.14 198 / ${opacity * 0.85}) 0%, transparent 68%)`,
          filter: `blur(${blur})`,
          willChange: "transform",
        }}
        animate={{ x: [0, -52, 36, 0], y: [0, 44, -26, 0], scale: [1, 1.09, 0.93, 1] }}
        transition={{ ...t, duration: 34, delay: 6 }}
      />

      {/* Blob 3 — muted mint, bottom-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "42vw", height: "42vw",
          maxWidth: 640, maxHeight: 640,
          bottom: "-18%", left: "-16%",
          background: `radial-gradient(circle, oklch(0.64 0.13 158 / ${opacity * 0.8}) 0%, transparent 68%)`,
          filter: `blur(${blur})`,
          willChange: "transform",
        }}
        animate={{ x: [0, 36, -44, 0], y: [0, -32, 42, 0], scale: [1, 0.94, 1.08, 1] }}
        transition={{ ...t, duration: 30, delay: 12 }}
      />

      {/* Blob 4 — pale peach, bottom-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "38vw", height: "38vw",
          maxWidth: 580, maxHeight: 580,
          bottom: "-12%", right: "-12%",
          background: `radial-gradient(circle, oklch(0.66 0.12 32 / ${opacity * 0.7}) 0%, transparent 68%)`,
          filter: `blur(${blur})`,
          willChange: "transform",
        }}
        animate={{ x: [0, -38, 28, 0], y: [0, 52, -36, 0], scale: [1, 1.06, 0.94, 1] }}
        transition={{ ...t, duration: 36, delay: 18 }}
      />

      {/* Blob 5 — lavender, center — very faint depth layer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "32vw", height: "32vw",
          maxWidth: 480, maxHeight: 480,
          top: "38%", left: "32%",
          background: `radial-gradient(circle, oklch(0.58 0.12 240 / ${opacity * 0.55}) 0%, transparent 68%)`,
          filter: `blur(${blur})`,
          willChange: "transform",
        }}
        animate={{ x: [0, 60, -20, 0], y: [0, -48, 28, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ ...t, duration: 40, delay: 24 }}
      />

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 100%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial vignette — pulls focus to center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, oklch(0.06 0.016 278 / 55%) 100%)",
        }}
      />
    </div>
  )
}
