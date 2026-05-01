import Link from "next/link"
import { GitBranch, MessageCircle } from "lucide-react"

function FooterLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 mb-5">
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="13" stroke="url(#fl-ring)" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3.5" fill="url(#fl-center)" />
        <line x1="14" y1="1"  x2="14" y2="7"  stroke="url(#fl-spoke)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="21" x2="14" y2="27" stroke="url(#fl-spoke)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1"  y1="14" x2="7"  y2="14" stroke="url(#fl-spoke)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="21" y1="14" x2="27" y2="14" stroke="url(#fl-spoke)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="fl-ring" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="oklch(0.72 0.13 285)" />
            <stop offset="1" stopColor="oklch(0.70 0.12 198)" />
          </linearGradient>
          <linearGradient id="fl-center" x1="10.5" y1="10.5" x2="17.5" y2="17.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="oklch(0.72 0.13 285)" />
            <stop offset="1" stopColor="oklch(0.70 0.12 198)" />
          </linearGradient>
          <linearGradient id="fl-spoke" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="oklch(0.72 0.13 285 / 65%)" />
            <stop offset="1" stopColor="oklch(0.70 0.12 198 / 65%)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[13px] font-semibold text-white/70 group-hover:text-white/90 transition-colors">
        MCP Explorer
      </span>
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-[oklch(0.085_0.018_278/90%)] backdrop-blur-xl" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <FooterLogo />
            <p className="text-[13px] text-white/35 max-w-xs leading-relaxed mb-5">
              The premium developer platform to discover, inspect, and test public MCP servers.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/modelcontextprotocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-white/35 hover:text-white/70 hover:border-white/[0.12] transition-all"
              >
                <GitBranch className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com/anthropicai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-white/35 hover:text-white/70 hover:border-white/[0.12] transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-label text-white/30 mb-4">Product</p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/explore" className="text-[13px] text-white/40 hover:text-white/75 transition-colors">
                  Explore Servers
                </Link>
              </li>
              <li>
                <Link href="/playground" className="text-[13px] text-white/40 hover:text-white/75 transition-colors">
                  Playground
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-label text-white/30 mb-4">Resources</p>
            <ul className="space-y-2.5">
              <li>
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer"
                  className="text-[13px] text-white/40 hover:text-white/75 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer"
                  className="text-[13px] text-white/40 hover:text-white/75 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://spec.modelcontextprotocol.io" target="_blank" rel="noopener noreferrer"
                  className="text-[13px] text-white/40 hover:text-white/75 transition-colors">
                  Specification
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} MCP Explorer. Built for the Model Context Protocol community.
          </p>
          <p className="text-[11px] text-white/20">Not affiliated with Anthropic</p>
        </div>
      </div>
    </footer>
  )
}
