# MCP Explorer

A production-grade developer platform to discover, inspect, and test public MCP (Model Context Protocol) servers from the official registry.

**Live:** [mcp-explorer-phi.vercel.app](https://mcp-explorer-phi.vercel.app/)

---

## Features

- **Explore** — Browse 500+ real MCP servers from the official registry with live search, category filters, and sort options
- **Server Detail** — View metadata, remote endpoints, tags, and connection info for every server
- **Playground** — Execute real MCP tools against live remote servers via a secure server-side proxy
- **Real Data** — All data comes directly from `registry.modelcontextprotocol.io` — no mock data

## Tech Stack

- **Next.js 16** (App Router, Edge + Node runtimes)
- **TypeScript** — strict, fully typed
- **Tailwind CSS v4**
- **shadcn/ui** (base-nova)
- **Framer Motion**
- **Lucide Icons**

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── servers/          # Registry proxy (edge)
│   │   ├── servers/[slug]/   # Single server lookup (edge)
│   │   └── playground/
│   │       ├── tools/        # Fetch real tools/list (node)
│   │       └── execute/      # Execute tools/call (node)
│   ├── explore/              # Browse page
│   ├── playground/           # Playground page
│   └── server/[slug]/        # Server detail page
├── components/
│   ├── playground/
│   │   ├── param-form.tsx    # Dynamic schema-driven form
│   │   └── result-view.tsx   # Structured result display
│   └── sections/             # Landing page sections
└── lib/
    ├── registry/             # MCP Registry API client
    └── playground/
        ├── mcp-client.ts     # Real MCP Streamable-HTTP client
        └── types.ts          # MCP JSON-RPC wire types
```

## MCP Playground

The playground executes **real** MCP tool calls:

1. Fetches available tools from the server via `tools/list`
2. Renders a dynamic form from the tool's JSON Schema
3. Sends a real `tools/call` JSON-RPC request server-side
4. Displays the actual response

All execution happens server-side — the browser never touches MCP endpoints directly.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prajwalmedinest-lgtm/mcp-explorer)

Or via CLI:

```bash
npm i -g vercel
vercel
```

## License

MIT
