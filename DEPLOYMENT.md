# Deployment Guide

## Quick Deploy Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

**Or use Vercel CLI:**
```bash
npm install -g vercel
vercel
```

### Netlify
1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Import repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

**Build and run:**
```bash
docker build -t mcp-explorer .
docker run -p 3000:3000 mcp-explorer
```

### Static Export (Optional)

If you want to deploy as static HTML:

1. Update `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

2. Build:
```bash
npm run build
```

3. Deploy the `out/` directory to any static host (GitHub Pages, Cloudflare Pages, etc.)

## Environment Variables

Currently, the app doesn't require any environment variables. If you add API integrations:

```env
# Example for future API integration
NEXT_PUBLIC_MCP_REGISTRY_API=https://api.example.com
MCP_API_KEY=your_secret_key
```

## Performance Optimization

### Already Implemented
- ✅ Static generation for all pages
- ✅ Optimized images (Next.js Image component ready)
- ✅ Code splitting
- ✅ CSS optimization
- ✅ Framer Motion lazy loading

### Additional Optimizations
- Add `next/image` for any images you add
- Enable compression in production
- Use CDN for static assets
- Add caching headers

## Monitoring

### Vercel Analytics
Add to `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Google Analytics
Add to `layout.tsx`:
```typescript
import Script from 'next/script'

// Add in <head>
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

## SSL/HTTPS

Both Vercel and Netlify provide automatic SSL certificates. No configuration needed!

## Build Optimization

The current build is already optimized:
- Bundle size: ~200KB (gzipped)
- First Load JS: ~85KB
- Static pages: 14 pages pre-rendered

## Troubleshooting

### Build fails on deployment
- Ensure Node.js version is 18+
- Check that all dependencies are in `package.json`
- Verify TypeScript compiles locally

### Styles not loading
- Ensure TailwindCSS v4 is supported by your host
- Check that `globals.css` is imported in `layout.tsx`

### Animations not working
- Verify Framer Motion is installed
- Check browser compatibility

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify search and filters work
- [ ] Check mobile responsiveness
- [ ] Test navigation between pages
- [ ] Verify animations are smooth
- [ ] Check console for errors
- [ ] Test on different browsers
- [ ] Verify SEO meta tags
- [ ] Check page load speed
- [ ] Test 404 page

## Support

For issues:
1. Check Next.js docs: https://nextjs.org/docs
2. Check Vercel docs: https://vercel.com/docs
3. Review build logs for errors

---

**Ready to deploy!** 🚀
