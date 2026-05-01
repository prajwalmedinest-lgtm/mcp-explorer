import { Navbar } from "@/components/navbar"
import { MeshBackground } from "@/components/mesh-background"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedServers } from "@/components/sections/featured-servers"
import { StatsSection } from "@/components/sections/stats-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { PlaygroundPreview } from "@/components/sections/playground-preview"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="relative">
        <HeroSection />
        <FeaturedServers />
        <StatsSection />
        <CategoriesSection />
        <PlaygroundPreview />
      </main>
      <Footer />
    </>
  )
}
