---
Task ID: 1
Agent: Main
Task: Implement Live Audio Podcast Streaming System

Work Log:
- Added LivePodcast model to Prisma schema (title, streamUrl, sourceType, isActive, status, description)
- Pushed schema to Neon PostgreSQL database
- Seeded initial LivePodcast record
- Created /api/admin/podcast/route.ts - Admin CRUD for podcast settings (GET/POST/PUT/DELETE with auth)
- Created /api/podcast/route.ts - Public endpoint for polling podcast status (returns isLive, title, streamUrl, status, description)
- Updated /api/data/route.ts to include livePodcast in public data response
- Updated /api/admin/route.ts to include livePodcast in admin data response
- Created /src/lib/PodcastContext.tsx - Global React context managing audio state (isLive, isPlaying, title, streamUrl), persistent HTML5 Audio element, 8-second polling for live status
- Created /src/components/PodcastPlayer.tsx - Floating mini player with LIVE badge, equalizer bars animation, play/pause, minimize/expand
- Created /src/components/LivePodcastRing.tsx - Streaming ring animation around hero avatar (3 pulsing rings + glow effect), LIVE indicator badge, play/pause button, mini equalizer overlay
- Created /src/components/PodcastShell.tsx - Client component wrapper for PodcastProvider + PodcastPlayer (needed because layout.tsx is Server Component)
- Updated /src/app/layout.tsx - Wrapped children with PodcastShell
- Updated /src/app/HomeClient.tsx - Added dynamic import for LivePodcastRing, wrapped hero avatar with LivePodcastRing
- Updated /src/app/admin/AdminClient.tsx - Added podcast to Section type, SECTIONS array (with Radio icon), AdminData interface, created PodcastSection component with full admin UI, added case in renderSectionContent
- Fixed .env DATABASE_URL from pooler to non-pooler Neon hostname
- Verified all API endpoints work correctly (admin CRUD + public polling)
- Verified frontend pages compile and render without errors
- Dev server running at localhost:3000

Stage Summary:
- Full live podcast streaming system implemented end-to-end
- Admin can start/stop live mode, change stream URL, update title/status
- Homepage hero avatar shows animated streaming rings + play/pause button when live
- Persistent global audio player continues across page navigation
- Public API polls every 8 seconds for real-time status updates
- All existing frontend UI/UX preserved (no layout/structure changes)
