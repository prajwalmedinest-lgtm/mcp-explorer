"use client"

import { motion } from "framer-motion"

/**
 * Aurora Background
 * 
 * Inspired by Apple WWDC and Linear.app
 * Features flowing, aurora-like gradients with subtle movement
 * Perfect for hero sections and landing pages
 */

interface AuroraBackgroundProps {
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function AuroraBackground({ 
  className = "",
  intensity = "medium" 
}: AuroraBackgroundProps) {
  
  const intensityConfig = {
    low: { opacity: 0.08, blur: "120px", scale: 0.9 },
    medium: { opacity: 0.12, blur: "100px", scale: 1 },
    high: { opacity: 0.18, blur: "80px", scale: 1.1 },
  }

  const config = intensityConfig[intensity]

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[oklch(0.07_0.02_280)]" />

      {/* Aurora wave 1 - Lavender to Cyan */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 150% 80% at 50% -20%,
              oklch(0.65 0.2 290 / ${config.opacity}) 0%,
              oklch(0.7 0.15 200 / ${config.opacity * 0.6}) 40%,
              transparent 70%
            )
          `,
          filter: `blur(${config.blur})`,
          willChange: "transform",
        }}
        animate={{
          scale: [config.scale, config.scale * 1.05, config.scale],
          opacity: [config.opacity, config.opacity * 1.2, config.opacity],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Aurora wave 2 - Mint to Peach */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 140% 70% at 50% 120%,
              oklch(0.72 0.18 160 / ${config.opacity * 0.9}) 0%,
              oklch(0.75 0.16 30 / ${config.opacity * 0.5}) 40%,
              transparent 70%
            )
          `,
          filter: `blur(${config.blur})`,
          willChange: "transform",
        }}
        animate={{
          scale: [config.scale, config.scale * 1.08, config.scale],
          opacity: [config.opacity * 0.9, config.opacity * 1.1, config.opacity * 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Aurora wave 3 - Soft Cyan sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 60% at 80% 50%,
              oklch(0.7 0.15 200 / ${config.opacity * 0.8}) 0%,
              oklch(0.68 0.14 240 / ${config.opacity * 0.4}) 50%,
              transparent 70%
            )
          `,
          filter: `blur(${config.blur})`,
          willChange: "transform",
        }}
        animate={{
          x: [0, -100, 0],
          scale: [config.scale * 0.95, config.scale * 1.1, config.scale * 0.95],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      />

      {/* Subtle shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              oklch(1 0 0 / 0.02) 50%,
              transparent 100%
            )
          `,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Depth vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, oklch(0.06 0.02 280 / 0.6) 100%)`,
        }}
      />
    </div>
  )
}
