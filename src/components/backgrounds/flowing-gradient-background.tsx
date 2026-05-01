"use client"

import { motion } from "framer-motion"

/**
 * Flowing Gradient Background
 * 
 * Inspired by Linear.app
 * Features smooth, flowing gradients with directional movement
 * Creates a sense of calm, continuous motion
 */

interface FlowingGradientBackgroundProps {
  className?: string
  direction?: "horizontal" | "vertical" | "diagonal"
  speed?: "slow" | "medium" | "fast"
}

export function FlowingGradientBackground({ 
  className = "",
  direction = "diagonal",
  speed = "slow"
}: FlowingGradientBackgroundProps) {
  
  const speedConfig = {
    slow: 40,
    medium: 30,
    fast: 20,
  }

  const duration = speedConfig[speed]

  const directionVariants = {
    horizontal: {
      animate: { x: ["0%", "100%", "0%"] },
    },
    vertical: {
      animate: { y: ["0%", "100%", "0%"] },
    },
    diagonal: {
      animate: { 
        x: ["0%", "50%", "0%"],
        y: ["0%", "50%", "0%"],
      },
    },
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[oklch(0.08_0.02_280)]" />

      {/* Flowing gradient layer 1 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              oklch(0.65 0.2 290 / 0.15) 0%,
              oklch(0.7 0.15 200 / 0.1) 25%,
              transparent 50%,
              oklch(0.72 0.18 160 / 0.08) 75%,
              oklch(0.75 0.16 30 / 0.12) 100%
            )
          `,
          filter: "blur(100px)",
          willChange: "transform",
        }}
        animate={directionVariants[direction].animate}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Flowing gradient layer 2 - offset for depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              225deg,
              oklch(0.68 0.14 240 / 0.12) 0%,
              transparent 30%,
              oklch(0.7 0.15 200 / 0.15) 60%,
              oklch(0.65 0.2 290 / 0.08) 100%
            )
          `,
          filter: "blur(120px)",
          willChange: "transform",
        }}
        animate={directionVariants[direction].animate}
        transition={{
          duration: duration * 1.3,
          repeat: Infinity,
          ease: "linear",
          delay: duration * 0.3,
        }}
      />

      {/* Flowing gradient layer 3 - subtle accent */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at 50% 50%,
              oklch(0.72 0.18 160 / 0.1) 0%,
              transparent 60%
            )
          `,
          filter: "blur(80px)",
          willChange: "transform",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: duration * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              oklch(1 0 0 / 0.015) 50%,
              transparent 100%
            )
          `,
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: duration * 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Depth vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, oklch(0.06 0.02 280 / 0.5) 100%)`,
        }}
      />
    </div>
  )
}
