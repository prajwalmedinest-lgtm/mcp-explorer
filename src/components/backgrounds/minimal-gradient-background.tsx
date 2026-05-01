"use client"

import { motion } from "framer-motion"

/**
 * Minimal Gradient Background
 * 
 * Ultra-subtle background for maximum content focus
 * Perfect for documentation, dashboards, and content-heavy pages
 * Barely noticeable but adds premium feel
 */

interface MinimalGradientBackgroundProps {
  className?: string
  accent?: "lavender" | "cyan" | "mint" | "peach" | "neutral"
}

export function MinimalGradientBackground({ 
  className = "",
  accent = "neutral"
}: MinimalGradientBackgroundProps) {
  
  const accentColors = {
    lavender: "oklch(0.65 0.2 290)",
    cyan: "oklch(0.7 0.15 200)",
    mint: "oklch(0.72 0.18 160)",
    peach: "oklch(0.75 0.16 30)",
    neutral: "oklch(0.68 0.14 240)",
  }

  const accentColor = accentColors[accent]

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.02_280)] via-[oklch(0.085_0.022_275)] to-[oklch(0.075_0.018_285)]" />

      {/* Subtle top accent */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${accentColor} / 0.04) 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
        animate={{
          opacity: [0.04, 0.06, 0.04],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle bottom accent */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[50vh]"
        style={{
          background: `radial-gradient(ellipse 90% 50% at 50% 100%, ${accentColor} / 0.03) 0%, transparent 70%)`,
          filter: "blur(120px)",
        }}
        animate={{
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Ultra-subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 100%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 100%) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Gentle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, oklch(0.07 0.02 280 / 0.3) 100%)`,
        }}
      />
    </div>
  )
}
