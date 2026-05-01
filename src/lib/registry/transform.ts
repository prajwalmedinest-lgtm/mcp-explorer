import type {
  RawServerEntry,
  NormalizedServer,
  ServerCategory,
} from "./types"

// ─── Category inference ───────────────────────────────────────────────────────

const CATEGORY_PATTERNS: Array<{ pattern: RegExp; category: ServerCategory }> = [
  // AI & Agents — check first, broad
  { pattern: /\b(ai|agent|llm|gpt|claude|openai|anthropic|embedding|vector|rag|inference|model|nlp|ml|machine.?learning)\b/i, category: "AI & Agents" },
  // Developer Tools
  { pattern: /\b(github|gitlab|git|code|deploy|ci|cd|devops|docker|kubernetes|k8s|terraform|npm|pypi|package|sdk|api|debug|lint|test|build|compiler|ide|editor|vscode)\b/i, category: "Developer Tools" },
  // Data & Analytics
  { pattern: /\b(database|sql|postgres|mysql|sqlite|mongo|redis|analytics|data|dataset|warehouse|etl|pipeline|chart|metric|dashboard|bi|tableau|snowflake|bigquery)\b/i, category: "Data & Analytics" },
  // Finance
  { pattern: /\b(finance|financial|trading|crypto|stock|market|payment|invoice|accounting|tax|bank|wallet|defi|blockchain|ledger|quickbooks|stripe)\b/i, category: "Finance" },
  // Security
  { pattern: /\b(security|auth|oauth|sso|compliance|vulnerability|pentest|audit|encryption|firewall|threat|malware|siem|zero.?trust)\b/i, category: "Security" },
  // Search
  { pattern: /\b(search|index|crawl|scrape|web|browse|fetch|spider|sitemap|seo)\b/i, category: "Search" },
  // Communication
  { pattern: /\b(slack|email|gmail|outlook|calendar|meeting|chat|message|notification|sms|whatsapp|discord|teams|zoom|video|call)\b/i, category: "Communication" },
  // Productivity
  { pattern: /\b(notion|linear|jira|trello|asana|todo|task|project|note|document|wiki|knowledge|productivity|workflow|automation|zapier|make)\b/i, category: "Productivity" },
  // Infrastructure
  { pattern: /\b(cloud|aws|azure|gcp|server|hosting|cdn|dns|domain|storage|s3|compute|vm|container|infra|network|monitoring|logging|observability)\b/i, category: "Infrastructure" },
]

export function inferCategory(name: string, description: string): ServerCategory {
  const text = `${name} ${description}`.toLowerCase()
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category
  }
  return "Other"
}

// ─── Tag extraction ───────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "via", "from", "your", "that", "this",
  "are", "can", "has", "have", "its", "more", "any", "all", "new",
  "mcp", "server", "tool", "tools", "api", "data", "using", "based",
])

export function extractTags(name: string, description: string): string[] {
  // Pull meaningful words from name segments and description
  const nameParts = name
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/[\s./_-]+/)
    .filter(Boolean)

  const descWords = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w))

  const candidates = [...new Set([...nameParts.map(p => p.toLowerCase()), ...descWords])]
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  // Prefer shorter, more meaningful tokens; cap at 5
  return candidates.slice(0, 5)
}

// ─── Slug generation ──────────────────────────────────────────────────────────

/**
 * Converts a registry name like `io.github.user/my-repo` into a URL-safe slug
 * like `io-github-user-my-repo`. Stable and reversible enough for routing.
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ─── Display name ─────────────────────────────────────────────────────────────

export function resolveDisplayName(raw: RawServerEntry["server"]): string {
  if (raw.title) return raw.title

  // Derive from the registry name: `io.github.user/repo` → `repo`
  const parts = raw.name.split("/")
  const last = parts[parts.length - 1] ?? raw.name
  return last
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()
}

// ─── GitHub URL ───────────────────────────────────────────────────────────────

export function resolveGithubUrl(raw: RawServerEntry["server"]): string | null {
  if (raw.repository?.source === "github" && raw.repository.url) {
    return raw.repository.url
  }
  return null
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformEntry(entry: RawServerEntry): NormalizedServer {
  const { server, _meta } = entry
  const official = _meta?.["io.modelcontextprotocol.registry/official"]

  const displayName = resolveDisplayName(server)
  const description = server.description?.trim() ?? ""
  const category = inferCategory(server.name, description)
  const tags = extractTags(server.name, description)
  const githubUrl = resolveGithubUrl(server)
  const remoteUrls = (server.remotes ?? []).map(r => r.url).filter(Boolean)

  return {
    id: `${server.name}@${server.version}`,
    slug: nameToSlug(server.name),
    name: server.name,
    displayName,
    description,
    version: server.version,
    category,
    tags,
    githubUrl,
    websiteUrl: server.websiteUrl ?? null,
    remoteUrls,
    hasRemote: remoteUrls.length > 0,
    hasPackage: Array.isArray(server.packages) && server.packages.length > 0,
    publishedAt: official?.publishedAt ?? "",
    updatedAt: official?.updatedAt ?? "",
    isLatest: official?.isLatest ?? false,
  }
}
