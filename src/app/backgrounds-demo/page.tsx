"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  PremiumMeshBackground,
  AuroraBackground,
  GradientOrbsBackground,
  FlowingGradientBackground,
  MinimalGradientBackground,
} from "@/components/backgrounds"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type BackgroundType = 
  | "premium-mesh"
  | "aurora"
  | "gradient-orbs"
  | "flowing"
  | "minimal"

export default function BackgroundsDemoPage() {
  const [activeBackground, setActiveBackground] = useState<BackgroundType>("premium-mesh")

  const backgrounds = [
    {
      id: "premium-mesh" as BackgroundType,
      name: "Premium Mesh",
      description: "Multi-layered gradient blobs with organic movement",
      recommended: "Landing pages, hero sections",
    },
    {
      id: "aurora" as BackgroundType,
      name: "Aurora",
      description: "Flowing aurora-like gradients inspired by Apple WWDC",
      recommended: "Hero sections, feature showcases",
    },
    {
      id: "gradient-orbs" as BackgroundType,
      name: "Gradient Orbs",
      description: "Large soft orbs with parallax depth",
      recommended: "Landing pages, marketing sites",
    },
    {
      id: "flowing" as BackgroundType,
      name: "Flowing Gradient",
      description: "Continuous directional gradient flow",
      recommended: "Dynamic pages, dashboards",
    },
    {
      id: "minimal" as BackgroundType,
      name: "Minimal",
      description: "Ultra-subtle for maximum content focus",
      recommended: "Documentation, content pages",
    },
  ]

  return (
    <>
      {/* Render active background */}
      {activeBackground === "premium-mesh" && <PremiumMeshBackground />}
      {activeBackground === "aurora" && <AuroraBackground />}
      {activeBackground === "gradient-orbs" && <GradientOrbsBackground />}
      {activeBackground === "flowing" && <FlowingGradientBackground />}
      {activeBackground === "minimal" && <MinimalGradientBackground />}

      <main className="relative min-h-screen px-4 sm:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              Premium Background System
            </Badge>
            <h1 className="text-5xl font-bold text-white/95 mb-4">
              Animated Mesh Gradients
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Elegant, GPU-optimized backgrounds for modern developer platforms.
              Smooth 60fps animations that enhance without overpowering content.
            </p>
          </motion.div>

          {/* Background selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backgrounds.map((bg, index) => (
                <motion.button
                  key={bg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setActiveBackground(bg.id)}
                  className={`text-left rounded-xl border p-5 transition-all ${
                    activeBackground === bg.id
                      ? "border-white/30 bg-white/10 shadow-2xl shadow-black/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    {bg.name}
                  </h3>
                  <p className="text-sm text-white/50 mb-3">
                    {bg.description}
                  </p>
                  <div className="text-xs text-white/40">
                    <span className="font-medium">Best for:</span> {bg.recommended}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">
                60fps Performance
              </h3>
              <p className="text-sm text-white/50">
                GPU-accelerated animations with will-change optimization for buttery smooth motion
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">
                Content-Friendly
              </h3>
              <p className="text-sm text-white/50">
                Carefully tuned opacity and blur to enhance without overpowering your content
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-3xl mb-3">🌙</div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">
                Dark Mode Native
              </h3>
              <p className="text-sm text-white/50">
                Designed specifically for dark interfaces with premium color palette
              </p>
            </div>
          </motion.div>

          {/* Sample content to show readability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-white/95 mb-4">
              Content Readability Test
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This text demonstrates how the background enhances readability rather than
              competing with content. The subtle gradients create depth and atmosphere
              while maintaining excellent contrast for text.
            </p>
            <p className="text-white/60 leading-relaxed mb-6">
              Notice how the animated elements move slowly and organically, creating a
              calming, premium feel without being distracting. This is perfect for
              developer platforms, SaaS products, and modern web applications.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 text-white/70">
                Elegant
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/70">
                Calm
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/70">
                Futuristic
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/70">
                Premium
              </Badge>
            </div>
          </motion.div>

          {/* Code example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 rounded-2xl border border-white/10 bg-[oklch(0.1_0.02_280)] p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-white/90 mb-4">
              Usage Example
            </h3>
            <pre className="text-sm text-white/70 overflow-x-auto">
              <code>{`import { ${backgrounds.find(b => b.id === activeBackground)?.name.replace(" ", "")}Background } from "@/components/backgrounds"

export default function Page() {
  return (
    <>
      <${backgrounds.find(b => b.id === activeBackground)?.name.replace(" ", "")}Background />
      <main>
        {/* Your content */}
      </main>
    </>
  )
}`}</code>
            </pre>
          </motion.div>
        </div>
      </main>
    </>
  )
}
