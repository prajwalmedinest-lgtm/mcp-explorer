// ─── Raw API shapes (what the registry actually returns) ─────────────────────

export interface RegistryRemote {
  type: "streamable-http" | "sse" | string
  url: string
}

export interface RegistryRepository {
  url: string
  source: "github" | "gitlab" | string
  id?: string
  subfolder?: string
}

export interface RegistryPackage {
  registry: "npm" | "pypi" | "crates" | string
  name: string
  version?: string
}

export interface RegistryServerMeta {
  status: "active" | "deprecated" | string
  statusChangedAt: string
  publishedAt: string
  updatedAt: string
  isLatest: boolean
}

/** Raw server object as returned by the API */
export interface RawServer {
  $schema?: string
  name: string
  title?: string
  description?: string
  version: string
  repository?: RegistryRepository
  remotes?: RegistryRemote[]
  packages?: RegistryPackage[]
  websiteUrl?: string
  icons?: Array<{ uri: string; type?: string }>
  _meta?: Record<string, unknown>
}

/** Raw list item wrapping a server + its registry metadata */
export interface RawServerEntry {
  server: RawServer
  _meta: {
    "io.modelcontextprotocol.registry/official"?: RegistryServerMeta
  }
}

/** Raw paginated response from GET /v0/servers */
export interface RawServersResponse {
  servers: RawServerEntry[]
  metadata: {
    nextCursor?: string
    count: number
  }
}

// ─── Normalised shapes (what the app uses) ───────────────────────────────────

export type ServerCategory =
  | "AI & Agents"
  | "Developer Tools"
  | "Data & Analytics"
  | "Productivity"
  | "Search"
  | "Communication"
  | "Finance"
  | "Security"
  | "Infrastructure"
  | "Other"

export interface NormalizedServer {
  /** Unique stable ID: `name@version` */
  id: string
  /** URL-safe slug derived from registry name, e.g. `io-github-user-repo` */
  slug: string
  /** Registry name, e.g. `io.github.user/repo` */
  name: string
  /** Human-readable display name */
  displayName: string
  description: string
  version: string
  category: ServerCategory
  /** Derived tags from name + description */
  tags: string[]
  githubUrl: string | null
  websiteUrl: string | null
  /** Remote connection URLs (streamable-http / SSE) */
  remoteUrls: string[]
  hasRemote: boolean
  hasPackage: boolean
  publishedAt: string
  updatedAt: string
  isLatest: boolean
}

// ─── API layer result types ───────────────────────────────────────────────────

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number }

export interface FetchServersOptions {
  /** Max servers to return after deduplication. Default: 200 */
  limit?: number
  /** Only return the latest version of each server name. Default: true */
  latestOnly?: boolean
}

export interface SearchOptions {
  query?: string
  category?: ServerCategory | "all"
  sort?: "name" | "newest" | "oldest"
  limit?: number
}
