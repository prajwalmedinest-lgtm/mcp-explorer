"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { NormalizedServer, ServerCategory, SearchOptions } from "@/lib/registry"

interface UseServersState {
  servers: NormalizedServer[]
  total: number
  loading: boolean
  error: string | null
}

interface UseServersOptions {
  query?: string
  category?: ServerCategory | "all"
  sort?: SearchOptions["sort"]
  limit?: number
}

export function useServers(options: UseServersOptions = {}): UseServersState {
  const { query = "", category = "all", sort = "name", limit = 200 } = options

  const [state, setState] = useState<UseServersState>({
    servers: [],
    total: 0,
    loading: true,
    error: null,
  })

  // Debounce query changes to avoid hammering the route handler
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchServers = useCallback(async (opts: UseServersOptions, signal: AbortSignal) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const params = new URLSearchParams()
    if (opts.query)    params.set("q", opts.query)
    if (opts.category && opts.category !== "all") params.set("category", opts.category)
    if (opts.sort)     params.set("sort", opts.sort)
    if (opts.limit)    params.set("limit", String(opts.limit))

    try {
      const res = await fetch(`/api/servers?${params.toString()}`, { signal })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setState(prev => ({
          ...prev,
          loading: false,
          error: (body as { error?: string }).error ?? `Request failed (${res.status})`,
        }))
        return
      }

      const data = await res.json() as {
        servers: NormalizedServer[]
        total: number
        filtered: number
      }

      setState({
        servers: data.servers,
        total: data.total,
        loading: false,
        error: null,
      })
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load servers",
      }))
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const ctrl = new AbortController()

    // Debounce only the query; category/sort changes are instant
    const delay = query ? 300 : 0
    debounceRef.current = setTimeout(() => {
      fetchServers({ query, category, sort, limit }, ctrl.signal)
    }, delay)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      ctrl.abort()
    }
  }, [query, category, sort, limit, fetchServers])

  return state
}
