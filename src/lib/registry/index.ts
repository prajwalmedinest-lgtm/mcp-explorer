/**
 * MCP Registry API integration layer
 *
 * Usage:
 *   import { fetchAllServers, filterServers, ALL_CATEGORIES } from "@/lib/registry"
 */

export type {
  NormalizedServer,
  ServerCategory,
  ApiResult,
  FetchServersOptions,
  SearchOptions,
} from "./types"

export { fetchAllServers, fetchServerBySlug, fetchServerByName } from "./client"
export { filterServers, groupByCategory, countByCategory, ALL_CATEGORIES } from "./search"
export { inferCategory, extractTags, resolveDisplayName, nameToSlug } from "./transform"
