"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, FlaskConical, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/explore",                          label: "Explore",    icon: Search },
  { href: "/playground",                       label: "Playground", icon: FlaskConical },
  { href: "https://modelcontextprotocol.io",   label: "Docs",       icon: BookOpen, external: true },
]

/* ── Logo mark ─────────────────────────────────────────────────────────── */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
    >
      {/* Outer ring */}
      <circle cx="14" cy="14" r="13" stroke="url(#nb-ring)" strokeWidth="1.5" />
      {/* Inner cross / node */}
      <circle cx="14" cy="14" r="3.5" fill="url(#nb-center)" />
      {/* Spokes */}
      <line x1="14" y1="1"  x2="14" y2="7"  stroke="url(#nb-spoke)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="21" x2="14" y2="27" stroke="url(#nb-spoke)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1"  y1="14" x2="7"  y2="14" stroke="url(#nb-spoke)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="14" x2="27" y2="14" stroke="url(#nb-spoke)" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="nb-ring" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.72 0.13 285)" />
          <stop offset="1" stopColor="oklch(0.70 0.12 198)" />
        </linearGradient>
        <linearGradient id="nb-center" x1="10.5" y1="10.5" x2="17.5" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.72 0.13 285)" />
          <stop offset="1" stopColor="oklch(0.70 0.12 198)" />
        </linearGradient>
        <linearGradient id="nb-spoke" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.72 0.13 285 / 70%)" />
          <stop offset="1" stopColor="oklch(0.70 0.12 198 / 70%)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "py-2.5" : "py-5"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
              scrolled
                ? "glass-dark shadow-xl shadow-black/25"
                : "bg-transparent"
            )}
          >
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="text-[13px] font-semibold tracking-tight text-white/80 group-hover:text-white/95 transition-colors">
                MCP Explorer
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(link => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "text-white"
                        : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-white/[0.08]"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                    <link.icon className="relative h-3.5 w-3.5" />
                    <span className="relative">{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center">
              <Link
                href="/explore"
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white",
                  "bg-gradient-to-r from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)]",
                  "shadow-md shadow-[oklch(0.58_0.18_278)/20%]",
                  "hover:shadow-lg hover:shadow-[oklch(0.58_0.18_278)/30%]",
                  "hover:brightness-110 transition-all duration-200"
                )}
              >
                Browse Servers
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.09] transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[4.5rem] z-40 rounded-2xl glass-dark border border-white/[0.08] p-3 shadow-2xl shadow-black/40 md:hidden"
          >
            <nav className="flex flex-col gap-0.5">
              {NAV_LINKS.map(link => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-white/[0.09] text-white"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              <div className="mt-1 pt-2 border-t border-white/[0.07]">
                <Link
                  href="/explore"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Browse Servers
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
