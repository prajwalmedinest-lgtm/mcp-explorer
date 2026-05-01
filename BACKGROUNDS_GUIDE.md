# Premium Animated Background System

A collection of elegant, GPU-optimized gradient backgrounds for modern developer platforms.

## 🎨 Design Philosophy

These backgrounds are designed to:
- **Enhance, not overpower** — Subtle enough to maintain content readability
- **Feel premium** — Inspired by Linear, Vercel, Arc Browser, and Apple WWDC
- **Perform smoothly** — 60fps animations with GPU acceleration
- **Stay calm** — Slow, organic motion that's calming and atmospheric

## 📦 Available Backgrounds

### 1. Premium Mesh Background
**Best for:** Landing pages, hero sections, general use

The flagship background with 5 layered gradient blobs that float organically.

```tsx
import { PremiumMeshBackground } from "@/components/backgrounds"

<PremiumMeshBackground variant="default" />
```

**Variants:**
- `default` — Balanced opacity (0.15)
- `subtle` — Lower opacity (0.08) for content-heavy pages
- `vibrant` — Higher opacity (0.22) for marketing pages
- `minimal` — Ultra-subtle (0.05) for maximum focus

**Features:**
- 5 animated gradient blobs
- 25-35 second animation cycles
- Subtle grid overlay
- Radial vignette for depth
- Top fade for navbar area

---

### 2. Aurora Background
**Best for:** Hero sections, feature showcases

Flowing aurora-like gradients inspired by Apple WWDC presentations.

```tsx
import { AuroraBackground } from "@/components/backgrounds"

<AuroraBackground intensity="medium" />
```

**Intensity levels:**
- `low` — Opacity 0.08, blur 120px
- `medium` — Opacity 0.12, blur 100px
- `high` — Opacity 0.18, blur 80px

**Features:**
- 3 aurora wave layers
- Shimmer overlay effect
- Elliptical gradients
- 20-30 second cycles

---

### 3. Gradient Orbs Background
**Best for:** Landing pages, marketing sites

Large, soft gradient orbs with parallax-like depth, inspired by Vercel AI.

```tsx
import { GradientOrbsBackground } from "@/components/backgrounds"

<GradientOrbsBackground orbCount={4} />
```

**Orb counts:**
- `3` — Minimal, spacious
- `4` — Balanced (recommended)
- `5` — Rich, layered

**Features:**
- Configurable orb count
- Responsive sizing (vw-based)
- Subtle noise texture
- 26-35 second cycles per orb

---

### 4. Flowing Gradient Background
**Best for:** Dynamic pages, dashboards

Continuous directional gradient flow inspired by Linear.app.

```tsx
import { FlowingGradientBackground } from "@/components/backgrounds"

<FlowingGradientBackground direction="diagonal" speed="slow" />
```

**Directions:**
- `horizontal` — Left to right flow
- `vertical` — Top to bottom flow
- `diagonal` — Diagonal sweep (recommended)

**Speeds:**
- `slow` — 40s duration (calming)
- `medium` — 30s duration
- `fast` — 20s duration (dynamic)

**Features:**
- 3 gradient layers
- Shimmer effect
- Linear motion
- Depth vignette

---

### 5. Minimal Gradient Background
**Best for:** Documentation, content-heavy pages

Ultra-subtle background for maximum content focus.

```tsx
import { MinimalGradientBackground } from "@/components/backgrounds"

<MinimalGradientBackground accent="lavender" />
```

**Accents:**
- `lavender` — Purple tones
- `cyan` — Blue tones
- `mint` — Green tones
- `peach` — Warm tones
- `neutral` — Balanced

**Features:**
- Barely noticeable (0.03-0.06 opacity)
- Top and bottom accents
- Ultra-subtle grid
- Gentle vignette

---

## 🎯 Choosing the Right Background

| Use Case | Recommended Background | Variant/Settings |
|----------|----------------------|------------------|
| Landing page hero | Aurora or Premium Mesh | `intensity="medium"` or `variant="default"` |
| Marketing site | Gradient Orbs | `orbCount={4}` |
| Product pages | Premium Mesh | `variant="subtle"` |
| Documentation | Minimal | `accent="neutral"` |
| Dashboard | Flowing Gradient | `direction="diagonal"` `speed="slow"` |
| Blog/Content | Minimal | `accent="lavender"` |
| Feature showcase | Aurora | `intensity="high"` |

---

## 🎨 Color Palette

All backgrounds use the same premium color palette:

```css
/* Lavender */
oklch(0.65 0.2 290)

/* Soft Cyan */
oklch(0.7 0.15 200)

/* Mint */
oklch(0.72 0.18 160)

/* Peach Pink */
oklch(0.75 0.16 30)

/* Pastel Blue */
oklch(0.68 0.14 240)

/* Base Dark */
oklch(0.08 0.02 280)
```

---

## ⚡ Performance Optimization

All backgrounds are optimized for 60fps:

### GPU Acceleration
```tsx
style={{
  willChange: "transform",
  filter: "blur(100px)",
}}
```

### Efficient Animations
- Use `transform` (GPU-accelerated) instead of `top/left`
- Limit animated properties to `x`, `y`, `scale`, `opacity`
- Use `will-change` hint for browser optimization

### Blur Optimization
- Blur values: 60-120px (sweet spot for performance)
- Applied via CSS `filter` property
- Hardware-accelerated on modern browsers

---

## 📱 Responsive Design

All backgrounds are fully responsive:

```tsx
// Size constraints
width: "50vw"
maxWidth: "800px"

// Viewport-based sizing
w-[50vw] h-[50vw]

// Responsive positioning
-top-[20%] -left-[10%]
```

---

## 🌙 Dark Mode

All backgrounds are designed for dark mode:
- Base background: `oklch(0.08 0.02 280)`
- Gradient opacity: 0.05-0.22
- High contrast for text readability
- Purple undertones for premium feel

---

## 🎭 Animation Principles

### Timing
- **Duration:** 20-40 seconds per cycle
- **Easing:** `easeInOut` for organic motion
- **Stagger:** 5-10 second delays between elements

### Movement
- **Translation:** ±30-80px range
- **Scale:** 0.9-1.15x range
- **Rotation:** Not used (keeps it calm)

### Opacity
- **Static:** 0.05-0.22 range
- **Animated:** ±20% variation
- **Never:** Full opacity (would overpower content)

---

## 🔧 Customization

### Creating Custom Variants

```tsx
// Custom opacity
<motion.div
  style={{
    background: `radial-gradient(circle, oklch(0.65 0.2 290 / 0.25) 0%, transparent 70%)`,
    filter: "blur(90px)",
  }}
/>

// Custom animation
animate={{
  x: [0, 100, 0],
  y: [0, -50, 0],
  scale: [1, 1.2, 1],
}}
transition={{
  duration: 30,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

### Combining Backgrounds

```tsx
// Layer multiple backgrounds
<>
  <MinimalGradientBackground accent="lavender" />
  <div className="absolute inset-0 -z-5">
    <GradientOrbsBackground orbCount={3} />
  </div>
</>
```

---

## 📊 Performance Metrics

### Bundle Size
- Each background: ~2-3KB (gzipped)
- Framer Motion: ~30KB (shared)
- Total overhead: ~35KB

### Runtime Performance
- 60fps on modern devices
- GPU-accelerated transforms
- Minimal CPU usage
- No layout thrashing

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Optimized for touch devices

---

## 🎯 Best Practices

### DO:
✅ Use subtle variants for content-heavy pages
✅ Match background intensity to page purpose
✅ Test readability with actual content
✅ Use consistent background across related pages
✅ Combine with glassmorphism UI elements

### DON'T:
❌ Use multiple animated backgrounds on one page
❌ Increase opacity beyond 0.25
❌ Add fast animations (keep it slow)
❌ Use on pages with video content
❌ Forget to test on mobile devices

---

## 🚀 Quick Start

1. **Install dependencies** (already done in this project)
```bash
npm install framer-motion
```

2. **Import a background**
```tsx
import { PremiumMeshBackground } from "@/components/backgrounds"
```

3. **Add to your page**
```tsx
export default function Page() {
  return (
    <>
      <PremiumMeshBackground />
      <main>{/* Your content */}</main>
    </>
  )
}
```

4. **Customize as needed**
```tsx
<PremiumMeshBackground variant="subtle" className="opacity-80" />
```

---

## 🎨 Design Inspiration

These backgrounds are inspired by:
- **Linear.app** — Flowing gradients, calm motion
- **Vercel** — Gradient orbs, premium feel
- **Arc Browser** — Pastel colors, soft transitions
- **Apple WWDC** — Aurora effects, elegant animations

---

## 📝 Examples

### Landing Page
```tsx
import { AuroraBackground } from "@/components/backgrounds"

export default function LandingPage() {
  return (
    <>
      <AuroraBackground intensity="medium" />
      <main>
        <h1>Welcome to Our Platform</h1>
        {/* Hero content */}
      </main>
    </>
  )
}
```

### Documentation
```tsx
import { MinimalGradientBackground } from "@/components/backgrounds"

export default function DocsPage() {
  return (
    <>
      <MinimalGradientBackground accent="neutral" />
      <main>
        {/* Documentation content */}
      </main>
    </>
  )
}
```

### Dashboard
```tsx
import { FlowingGradientBackground } from "@/components/backgrounds"

export default function Dashboard() {
  return (
    <>
      <FlowingGradientBackground 
        direction="diagonal" 
        speed="slow" 
      />
      <main>
        {/* Dashboard widgets */}
      </main>
    </>
  )
}
```

---

**Built with care for premium developer experiences** ✨
