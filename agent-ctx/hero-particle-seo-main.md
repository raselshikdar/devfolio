# Task: Hero Particle Animation + Complete SEO Optimization

## Summary

Implemented two major features: (1) Hero particle/network animation and (2) Complete SEO optimization for the Next.js portfolio website.

## Feature 1: Hero Particle Animation

### Created: `src/components/ParticleNetwork.tsx`
- `"use client"` component with canvas-based particle network animation
- ~70 particles floating slowly with connection lines between nearby particles
- Lines have opacity based on distance (closer = more opaque)
- Uses emerald (#10B981) color for particles and lines
- Semi-transparent rendering (particle opacity 0.6, max line opacity 0.35)
- Respects `prefers-reduced-motion` media query
- Responsive canvas resizing on window resize
- Proper cleanup on unmount with `requestAnimationFrame` cancellation
- `pointer-events-none` and `aria-hidden="true"` for accessibility

### Modified: `src/app/HomeClient.tsx`
- Added dynamic import for ParticleNetwork with `ssr: false`
- Hero CardShell now has `relative overflow-hidden` classes
- ParticleNetwork rendered as `absolute inset-0` background inside CardShell
- Existing hero content wrapped in `relative z-10` div to ensure interactivity
- Fixed a pre-existing lint error in `useCountUp` hook (removed unnecessary `setCount(0)` call in effect)

## Feature 2: Complete SEO Optimization

### Modified: `src/app/layout.tsx`
- Added `metadataBase` with production URL
- Added title template (`%s | Rasel Shikdar`)
- Enhanced description with experience details
- Expanded keywords list
- Added `openGraph` with type, locale, url, siteName, title, description, images
- Added `twitter` card with summary_large_image
- Added `robots` with googleBot directives (max-video-preview, max-image-preview, max-snippet)
- Added `alternates` with canonical URL
- Updated `icons` to include both `/favicon.png` and `/logo.svg`

### Created: `src/app/blog/[id]/layout.tsx`
- Dynamic metadata generation fetching blog post data from API
- OG tags, twitter card, canonical URL for individual blog posts
- Published time for article type OG

### Created: `src/app/projects/[id]/layout.tsx`
- Dynamic metadata generation fetching project data from API
- OG tags, twitter card, canonical URL for individual projects

### Created: `src/app/store/[id]/layout.tsx`
- Dynamic metadata generation fetching product data from API
- OG tags, twitter card, canonical URL for individual products

### Created: `src/app/sitemap.ts`
- Static pages with changeFrequency and priority
- Dynamic pages for blog posts, projects, and store products
- Fallback to static pages on API error

### Modified: `public/robots.txt`
- Added Sitemap reference
- Kept specific bot allowances (Googlebot, Bingbot)
- Wildcard User-agent with Allow

### Generated: `public/og-image.png`
- Professional developer portfolio OG image (1344x768)
- Dark theme with emerald accent

### Generated: `public/favicon.png`
- Letter R in emerald on dark navy background (1024x1024)

### Created listing page layouts with metadata:
- `src/app/projects/layout.tsx` — Projects page metadata
- `src/app/blog/layout.tsx` — Blog page metadata
- `src/app/store/layout.tsx` — Store page metadata
- `src/app/gallery/layout.tsx` — Gallery page metadata
- `src/app/contact/layout.tsx` — Contact page metadata

## Lint Status
- 0 errors, 1 pre-existing warning (unused eslint-disable in PodcastContext.tsx)
- All new code passes lint cleanly

## Issues
- Pre-existing Turbopack cache corruption required `.next` directory deletion
- Pre-existing `@swc/helpers` module resolution issue required manual copy to `node_modules/next/node_modules/@swc/helpers`
- Dev server compiles and serves homepage successfully (200 status)
