import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { MeshBackground } from "@/components/mesh-background"

export default function NotFound() {
  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-sm">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 278), oklch(0.56 0.16 198))" }}
          >
            <span className="text-2xl font-bold text-white">404</span>
          </div>
          <h1 className="text-[1.75rem] font-bold text-white/92 mb-3 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-[14px] text-white/45 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_278)] to-[oklch(0.56_0.16_198)] px-5 py-2.5 text-[13px] font-semibold text-white hover:brightness-110 transition-all"
            >
              <Home className="h-3.5 w-3.5" />
              Go Home
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 text-[13px] font-semibold text-white/65 hover:text-white/90 hover:bg-white/[0.07] transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              Explore Servers
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
