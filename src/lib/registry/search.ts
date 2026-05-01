import type { NormalizedServer, SearchOptions, ServerCategory } from "./types"

// ─── Filter ───────────────────────────────────────────────────────────────────

export function filterServers(
  servers: NormalizedServer[],
  options: SearchOptions
): NormalizedServer[] {
  const { query = "", category = "all", sort = "name", limit } = options

  let results = servers

  // Category filter
  if (category !== "all") {
    results = results.filter(s => s.category === category)
  }

  // Full-text search across display name, description, tags, and registry name
  if (query.trim()) {
    const q = query.trim().toLowerCase()
    results = results.filter(s =>
      s.displayName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    )
  }

  // Sort
  switch (sort) {
    case "newest":
      results = [...results].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      break
    case "oldest":
      results = [...results].sort(
        (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
      break
    case "name":
    default:
      results = [...results].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      )
  }

  if (limit !== undefined) {
    results = results.slice(0, limit)
  }

  return results
}

// ─── Category helpers ─────────────────────────────────────────────────────────

export const ALL_CATEGORIES: ServerCategory[] = [
  "AI & Agents",
  "Developer Tools",
  "Data & Analytics",
  "Productivity",
  "Search",
  "Communication",
  "Finance",
  "Security",
  "Infrastructure",
  "Other",
]

export function groupByCategory(
  servers: NormalizedServer[]
): Record<ServerCategory, NormalizedServer[]> {
  const groups = {} as Record<ServerCategory, NormalizedServer[]>
  for (const cat of ALL_CATEGORIES) groups[cat] = []
  for (const s of servers) groups[s.category].push(s)
  return groups
}

export function countByCategory(
  servers: NormalizedServer[]
): Record<string, number> {
  const counts: Record<string, number> = { all: servers.length }
  for (const s of servers) {
    counts[s.category] = (counts[s.category] ?? 0) + 1
  }
  return counts
}
