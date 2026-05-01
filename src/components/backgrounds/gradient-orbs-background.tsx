"use client"

import { motion } from "framer-motion"

/**
 * Gradient Orbs Background
 * 
 * Inspired by Vercel AI and Arc Browser
 * Features large, soft gradient orbs with parallax-like depth
 * Minimal and elegant
 */

interface GradientOrbsBackgroundProps {
  className?: string
  orbCount?: 3 | 4 | 5
}

export function GradientOrbsBackground({ 
  className = "",
  orbCount = 4 
}: GradientOrbsBackgroundProps) {
  
  const orbs = [
    {
      color: "oklch(0.65 0.2 290)", // Lavender
      size: "60vw",
      maxSize: "900px",
      position: { top: "-30%", left: "-20%" },
      duration: 28,
      delay: 0,
    },
    {
      color: "oklch(0.7 0.15 200)", // Soft Cyan
      size: "55vw",
      maxSize: "850px",
      position: { top: "-20%", right: "-25%" },
      duration: 32,
      delay: 8,
    },
    {
      color: "oklch(0.72 0.18 160)", // Mint
      size: "50vw",
      maxSize: "800px",
      position: { bottom: "-25%", left: "-15%" },
      duration: 30,
      delay: 16,
    },
    {
      color: "oklch(0.75 0.16 30)", // Peach
      size: "48vw",
      maxSize: "750px",
      position: { bottom: "-20%", right: "-20%" },
      duration: 26,
      delay: 12,
    },
    {
      color: "oklch(0.68 0.14 240)", // Pastel Blue
      size: "45vw",
      maxSize: "700px",
      position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      duration: 35,
      delay: 20,
    },
  ]

  const visibleOrbs = orbs.slice(0, orbCount)

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.07_0.025_275)] to-[oklch(0.09_0.02_285)]" />

      {/* Animated gradient orbs */}
      {visibleOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            maxWidth: orb.maxSize,
            maxHeight: orb.maxSize,
            ...orb.position,
            background: `radial-gradient(circle, ${orb.color} / 0.12) 0%, transparent 65%)`,
            filter: "blur(90px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Radial fade for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.02 280 / 0.5) 100%)`,
        }}
      />
    </div>
  )
}
