import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MeshBackground } from "@/components/mesh-background"
import { ServerDetailContent } from "@/components/server-detail-content"
import { Footer } from "@/components/footer"
import { fetchServerBySlug } from "@/lib/registry"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Don't pre-generate — too many servers, generate on demand and cache
export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await fetchServerBySlug(slug)

  if (!result.ok || !result.data) {
    return { title: "Server Not Found" }
  }

  return {
    title: `${result.data.displayName} — MCP Server`,
    description: result.data.description,
  }
}

export default async function ServerDetailPage({ params }: PageProps) {
  const { slug } = await params
  const result = await fetchServerBySlug(slug)

  if (!result.ok || !result.data) {
    notFound()
  }

  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20">
        <ServerDetailContent server={result.data} />
      </main>
      <Footer />
    </>
  )
}
