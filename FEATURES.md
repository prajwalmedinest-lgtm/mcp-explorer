# MCP Explorer — Feature Overview

## 🎨 Visual Design

### Color Palette
- **Primary Gradient:** Lavender → Soft Cyan
- **Accent Colors:** Mint, Peach Pink
- **Background:** Deep dark with purple undertones
- **Text:** High contrast white with opacity variations

### Design Elements
- **Glassmorphism:** Frosted glass cards with blur effects
- **Floating Gradients:** Animated ambient blobs in background
- **Glow Effects:** Subtle shadows on hover
- **Smooth Animations:** Fade-ins, scale transforms, floating motion

## 📄 Pages

### 1. Landing Page (`/`)
**Sections:**
- Hero with gradient text and CTA buttons
- Featured servers grid (3 cards)
- Registry statistics (4 metrics)
- Category browser (8 categories)
- Playground preview card

**Animations:**
- Staggered fade-in for all sections
- Floating background gradients
- Hover effects on cards
- Smooth scroll transitions

### 2. Explore Page (`/explore`)
**Features:**
- Real-time search bar
- Category filter badges
- Server cards grid (responsive)
- Empty state for no results
- Smooth filtering transitions

**Interactions:**
- Type to search instantly
- Click badges to filter
- Hover cards for glow effect
- Click cards to view details

### 3. Server Detail Page (`/server/[slug]`)
**Sections:**
- Server header with icon, name, stats
- Installation command with copy button
- Tabbed interface:
  - **Overview:** Description, tags, links
  - **Tools:** Expandable accordion with schemas
  - **Resources:** Resource cards with URIs

**Features:**
- Copy install command
- Expandable tool details
- JSON schema viewer
- GitHub/npm links

### 4. Playground Page (`/playground`)
**Layout:**
- Left sidebar: Server & tool selection
- Right panel: Parameters, response, schema

**Features:**
- Select any server and tool
- JSON parameter editor
- Execute button with loading state
- Formatted response viewer
- Schema reference panel

**Interactions:**
- Click server to load tools
- Click tool to load example params
- Edit JSON parameters
- Execute to see mock response

### 5. 404 Page (`/not-found`)
**Elements:**
- Large 404 badge
- Error message
- Navigation buttons (Home, Explore)

## 🎯 Components

### Navbar
- Floating glass navbar
- Scrolled state with backdrop blur
- Desktop navigation links
- Mobile hamburger menu
- Gradient CTA button

### Server Card
- Gradient icon badge
- Server name with verified badge
- Description (2 lines max)
- Tags (first 3)
- Stats: stars, tools count, version
- Hover glow effect
- Category-specific gradient

### Footer
- Brand section with logo
- Link columns (Product, Resources)
- Social icons
- Copyright notice

### Mesh Background
- 4 animated gradient blobs
- Subtle grid overlay
- Vignette effect
- Smooth floating motion

## 🛠️ Technical Features

### Performance
- Static site generation (SSG)
- Optimized bundle size
- Code splitting
- Lazy loading animations
- Efficient re-renders

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader friendly

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Responsive grid layouts
- Mobile navigation menu
- Touch-friendly interactions

### TypeScript
- Full type coverage
- Type-safe props
- Inferred types
- No `any` types

## 📊 Data Structure

### MCP Server Object
```typescript
{
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  category: string
  tags: string[]
  githubUrl?: string
  npmPackage?: string
  author: string
  stars: number
  version: string
  tools: MCPTool[]
  resources: MCPResource[]
  installCommand: string
  featured?: boolean
  verified?: boolean
  weeklyDownloads?: number
}
```

### MCP Tool Object
```typescript
{
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, SchemaProperty>
    required?: string[]
  }
}
```

## 🎭 Animation Details

### Page Transitions
- **Duration:** 400-600ms
- **Easing:** `[0.16, 1, 0.3, 1]` (ease-out-expo)
- **Stagger:** 50-100ms between elements

### Hover Effects
- **Scale:** 1.02x on cards
- **Glow:** Opacity 0 → 0.05
- **Duration:** 200-300ms
- **Easing:** ease-in-out

### Background Animation
- **Blob 1:** 18s loop, lavender
- **Blob 2:** 22s loop, cyan
- **Blob 3:** 20s loop, mint
- **Blob 4:** 25s loop, peach
- **Movement:** x/y translation + scale

## 🔍 Search & Filter

### Search Algorithm
- Case-insensitive matching
- Searches: name, description, tags, category
- Real-time results
- No debouncing (instant)

### Category Filter
- 8 categories + "All"
- Click to filter
- Shows count per category
- Gradient highlight for active

## 💡 User Experience

### Loading States
- Suspense boundary on explore page
- Loading spinner in playground
- Skeleton states ready to add

### Error States
- Empty search results
- No servers found message
- 404 page for invalid routes

### Success States
- Copy confirmation (checkmark)
- Successful execution (green badge)
- Smooth transitions

## 🎨 Design Tokens

### Spacing Scale
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### Border Radius
- sm: 0.5rem
- md: 0.75rem
- lg: 1rem
- xl: 1.5rem
- 2xl: 2rem

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)

## 🚀 Performance Metrics

### Build Output
- Total pages: 14
- Static pages: 14
- Dynamic routes: 8 (server details)
- Build time: ~8 seconds

### Bundle Size
- First Load JS: ~85KB
- Shared chunks: ~70KB
- Page-specific: ~15KB

### Lighthouse Scores (Expected)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

**Every detail crafted for a premium developer experience** ✨
