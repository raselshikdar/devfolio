"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Image as ImageIcon,
  Headphones,
  Video,
  StickyNote,
  Quote,
  Code2,
  Link2,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Play,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ─── Tab Definition ─── */

type GalleryTab = "about" | "albums" | "audio" | "video" | "notes" | "quotes" | "codes" | "links" | "guestbook";

const TABS: { key: GalleryTab; label: string; icon: React.ElementType }[] = [
  { key: "about", label: "About Me", icon: User },
  { key: "albums", label: "Albums", icon: ImageIcon },
  { key: "audio", label: "Audio", icon: Headphones },
  { key: "video", label: "Video", icon: Video },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "quotes", label: "Quotes", icon: Quote },
  { key: "codes", label: "Codes", icon: Code2 },
  { key: "links", label: "Links", icon: Link2 },
  { key: "guestbook", label: "Guestbook", icon: MessageSquare },
];

/* ─── Fallback Data ─── */

const FALLBACK_PROFILE = {
  id: "pr1",
  name: "Alex Morgan",
  tagline: "Full-Stack Developer & Designer — crafting elegant digital experiences with modern web technologies.",
  avatar: "https://picsum.photos/seed/avatar42/300/300",
  about: "I'm a passionate full-stack developer with 7+ years of experience building high-performance web applications. I specialize in React, Next.js, and Node.js ecosystems, with a keen eye for pixel-perfect UI and scalable architecture. I thrive at the intersection of design and engineering — translating complex requirements into intuitive, accessible products.",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "https://alexmorgan.dev",
  resume: "",
};

const FALLBACK_GALLERY_IMAGES = [
  { id: "g1", src: "https://picsum.photos/seed/gallery01/600/400", alt: "Mountain landscape at sunset", category: "Nature" },
  { id: "g2", src: "https://picsum.photos/seed/gallery02/600/400", alt: "Urban city skyline", category: "Urban" },
  { id: "g3", src: "https://picsum.photos/seed/gallery03/600/400", alt: "Ocean waves crashing", category: "Nature" },
  { id: "g4", src: "https://picsum.photos/seed/gallery04/600/400", alt: "Forest trail in autumn", category: "Nature" },
  { id: "g5", src: "https://picsum.photos/seed/gallery05/600/400", alt: "Desert sand dunes", category: "Nature" },
  { id: "g6", src: "https://picsum.photos/seed/gallery06/600/400", alt: "Northern lights display", category: "Nature" },
  { id: "g7", src: "https://picsum.photos/seed/gallery07/600/400", alt: "Tropical beach paradise", category: "Travel" },
  { id: "g8", src: "https://picsum.photos/seed/gallery08/600/400", alt: "Snowy mountain peaks", category: "Nature" },
  { id: "g9", src: "https://picsum.photos/seed/gallery09/600/400", alt: "Modern architecture detail", category: "Urban" },
  { id: "g10", src: "https://picsum.photos/seed/gallery10/600/400", alt: "Street photography at night", category: "Urban" },
  { id: "g11", src: "https://picsum.photos/seed/gallery11/600/400", alt: "Cherry blossom garden", category: "Nature" },
  { id: "g12", src: "https://picsum.photos/seed/gallery12/600/400", alt: "Historic European cathedral", category: "Travel" },
];

const FALLBACK_AUDIO = [
  { id: "a1", title: "Ambient Soundscapes", url: "https://soundcloud.com/ambient/ethereal-dreams", description: "Relaxing ambient music for deep focus", category: "Ambient" },
  { id: "a2", title: "Jazz Vibes Playlist", url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", description: "Smooth jazz for late night coding sessions", category: "Jazz" },
  { id: "a3", title: "Lo-Fi Beats", url: "https://soundcloud.com/lofi/lofi-hip-hop-radio", description: "Chill beats to relax and study to", category: "Lo-Fi" },
  { id: "a4", title: "Nature Recording", url: "https://example.com/audio/rain.mp3", description: "Gentle rain sounds for meditation", category: "Nature" },
];

const FALLBACK_VIDEO = [
  { id: "v1", title: "Building a Full-Stack App in 30 Minutes", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "Step-by-step tutorial on building with Next.js", category: "Tutorial" },
  { id: "v2", title: "CSS Animations Deep Dive", url: "https://www.youtube.com/watch?v=YszON9KljJI", description: "Mastering CSS keyframe animations", category: "Tutorial" },
  { id: "v3", title: "Design Process Walkthrough", url: "https://vimeo.com/123456789", description: "From wireframe to final product", category: "Design" },
  { id: "v4", title: "Conference Talk: The Future of Web", url: "https://www.youtube.com/watch?v=abc123", description: "Keynote at WebDev Conf 2025", category: "Talk" },
];

const FALLBACK_NOTES = [
  { id: "n1", title: "On Building for Scale", content: "The best architectures emerge not from upfront design, but from iterative refinement. Start simple, measure often, and refactor ruthlessly.", date: "May 20, 2026" },
  { id: "n2", title: "Design is How It Works", content: "Beautiful interfaces that don't solve real problems are just decoration. Always start with the user's pain point and work backwards to the solution.", date: "Apr 15, 2026" },
  { id: "n3", title: "The Power of Boring Tech", content: "Choose proven technologies for your stack. Innovation belongs in your product, not your infrastructure. Boring tech lets you move fast with confidence.", date: "Mar 08, 2026" },
  { id: "n4", title: "Shipping Beats Perfection", content: "A shipped product teaches you more than a perfect prototype ever could. Bias toward action, learn from real users, iterate quickly.", date: "Feb 22, 2026" },
];

const FALLBACK_QUOTES = [
  { id: "q1", text: "Code is like humor. When you have to explain it, it's bad.", context: "On writing clean code" },
  { id: "q2", text: "First, solve the problem. Then, write the code.", context: "On thinking before coding" },
  { id: "q3", text: "Simplicity is the soul of efficiency.", context: "On keeping things simple" },
  { id: "q4", text: "Make it work, make it right, make it fast.", context: "On iterative development" },
  { id: "q5", text: "The best error message is the one that never shows up.", context: "On defensive programming" },
];

const FALLBACK_CODE = [
  {
    id: "c1",
    title: "Debounce Hook",
    content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
    language: "typescript",
    description: "A custom React hook for debouncing values",
  },
  {
    id: "c2",
    title: "API Error Handler",
    content: `class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(\`API Error: \${status} \${statusText}\`);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, await res.json().catch(() => null));
  }
  return res.json();
}`,
    language: "typescript",
    description: "Typed API client with error handling",
  },
  {
    id: "c3",
    title: "CSS Glass Effect",
    content: `.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`,
    language: "css",
    description: "Glassmorphism card effect",
  },
];

const FALLBACK_LINKS = [
  { id: "l1", title: "Next.js Documentation", url: "https://nextjs.org/docs", description: "The official Next.js documentation", category: "Docs" },
  { id: "l2", title: "Tailwind CSS", url: "https://tailwindcss.com", description: "Utility-first CSS framework", category: "CSS" },
  { id: "l3", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/", description: "Official TypeScript handbook", category: "Docs" },
  { id: "l4", title: "Figma Community", url: "https://www.figma.com/community", description: "Design resources and templates", category: "Design" },
  { id: "l5", title: "GitHub", url: "https://github.com", description: "Where the world builds software", category: "Tools" },
];

const FALLBACK_GUESTBOOK = [
  { id: "gb1", name: "Sarah Chen", location: "New York, NY", email: null, phone: null, message: "Amazing portfolio! Love the clean design and attention to detail.", createdAt: "2026-05-15T10:30:00.000Z" },
  { id: "gb2", name: "Marcus Rivera", location: "London, UK", email: null, phone: null, message: "Your work on the TaskFlow project is incredible. Would love to collaborate!", createdAt: "2026-04-28T14:20:00.000Z" },
  { id: "gb3", name: "Aiko Tanaka", location: "Tokyo, Japan", email: null, phone: null, message: null, createdAt: "2026-03-10T08:45:00.000Z" },
];

/* ─── Helpers ─── */

function parseYouTubeId(url: string): string | null {
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match1 ? match1[1] : null;
}

function parseVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

/* ─── Fade-in Wrapper ─── */

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Card Shell ─── */

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-sm transition-colors duration-200 hover:border-emerald ${className}`}>
      {children}
    </div>
  );
}

/* ─── Empty State ─── */

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function GalleryPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [activeTab, setActiveTab] = useState<GalleryTab>("about");

  /* ─── Lightbox state ─── */
  const [lightbox, setLightbox] = useState<number | null>(null);

  /* ─── Data state ─── */
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY_IMAGES);
  const [audio, setAudio] = useState(FALLBACK_AUDIO);
  const [videoItems, setVideoItems] = useState(FALLBACK_VIDEO);
  const [notes, setNotes] = useState(FALLBACK_NOTES);
  const [quotes, setQuotes] = useState(FALLBACK_QUOTES);
  const [codeItems, setCodeItems] = useState(FALLBACK_CODE);
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const [guestbookEntries, setGuestbookEntries] = useState(FALLBACK_GUESTBOOK);

  /* ─── Guestbook form state ─── */
  const [gbName, setGbName] = useState("");
  const [gbLocation, setGbLocation] = useState("");
  const [gbEmail, setGbEmail] = useState("");
  const [gbPhone, setGbPhone] = useState("");
  const [gbMessage, setGbMessage] = useState("");
  const [gbSubmitting, setGbSubmitting] = useState(false);
  const [gbSuccess, setGbSuccess] = useState(false);

  /* ─── Tab bar scroll ref ─── */
  const tabBarRef = useRef<HTMLDivElement>(null);

  /* ─── Mount ─── */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  /* ─── Fetch data ─── */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) return;
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.galleryImages?.length) setGalleryImages(data.galleryImages);
        if (data.audio?.length) setAudio(data.audio);
        if (data.video?.length) setVideoItems(data.video);
        if (data.notes?.length) setNotes(data.notes);
        if (data.quotes?.length) setQuotes(data.quotes);
        if (data.code?.length) setCodeItems(data.code);
        if (data.links?.length) setLinks(data.links);
        if (data.guestbookEntries?.length) setGuestbookEntries(data.guestbookEntries);
      } catch {
        // Keep fallback data on error
      }
    }
    fetchData();
  }, []);

  /* ─── Scroll to top visibility ─── */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Lightbox keyboard navigation ─── */
  useEffect(() => {
    if (lightbox === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);
      else if (e.key === "ArrowLeft") setLightbox((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, galleryImages.length]);

  /* ─── Lightbox touch swipe ─── */
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartRef.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        setLightbox((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);
      } else {
        setLightbox((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);
      }
    }
    touchStartRef.current = null;
  }, [galleryImages.length]);

  /* ─── Guestbook submit ─── */
  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbLocation.trim()) return;
    setGbSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: gbName.trim(),
          location: gbLocation.trim(),
          email: gbEmail.trim() || null,
          phone: gbPhone.trim() || null,
          message: gbMessage.trim() || null,
        }),
      });
      if (res.ok) {
        const newEntry = await res.json();
        setGuestbookEntries((prev) => [newEntry, ...prev]);
        setGbName("");
        setGbLocation("");
        setGbEmail("");
        setGbPhone("");
        setGbMessage("");
        setGbSuccess(true);
        setTimeout(() => setGbSuccess(false), 4000);
      }
    } catch {
      // Silently fail
    } finally {
      setGbSubmitting(false);
    }
  };

  /* ─── Scroll tab into view on change ─── */
  const handleTabChange = (tab: GalleryTab) => {
    setActiveTab(tab);
    // Scroll the active tab button into view
    setTimeout(() => {
      const activeBtn = tabBarRef.current?.querySelector(`[data-tab="${tab}"]`);
      activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, 50);
  };

  /* ─── Tab content animation variants ─── */
  const tabContentVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Gallery</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* ─── Tab Bar ─── */}
      <div className="sticky top-14 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div
          ref={tabBarRef}
          className="max-w-6xl mx-auto flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              data-tab={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "bg-emerald text-white"
                  : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ─── About Me Tab ─── */}
          {activeTab === "about" && (
            <motion.div key="about" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FadeIn>
                <CardShell className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="shrink-0">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-emerald/30 overflow-hidden shadow-md">
                        <img
                          src={profile.avatar || "https://picsum.photos/seed/avatar42/300/300"}
                          alt={`${profile.name} profile photo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        <span className="text-emerald">{profile.name}</span>
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{profile.tagline}</p>
                    </div>
                  </div>
                </CardShell>
              </FadeIn>

              <FadeIn delay={0.08}>
                <CardShell className="p-6 mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">About</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{profile.about}</p>
                </CardShell>
              </FadeIn>

              <FadeIn delay={0.16}>
                <CardShell className="p-6 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.email && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Email</p>
                          <p className="text-sm text-foreground truncate">{profile.email}</p>
                        </div>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Phone</p>
                          <p className="text-sm text-foreground truncate">{profile.phone}</p>
                        </div>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Location</p>
                          <p className="text-sm text-foreground truncate">{profile.location}</p>
                        </div>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Website</p>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald hover:underline truncate block">
                            {profile.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardShell>
              </FadeIn>
            </motion.div>
          )}

          {/* ─── Albums Tab ─── */}
          {activeTab === "albums" && (
            <motion.div key="albums" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {galleryImages.map((img, i) => (
                  <FadeIn key={img.id} delay={i * 0.04}>
                    <button
                      onClick={() => setLightbox(i)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-emerald transition-colors cursor-pointer w-full"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      {img.category && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm rounded-md">
                          {img.category}
                        </span>
                      )}
                    </button>
                  </FadeIn>
                ))}
              </div>
              {galleryImages.length === 0 && <EmptyState icon={ImageIcon} message="No images yet." />}
            </motion.div>
          )}

          {/* ─── Audio Tab ─── */}
          {activeTab === "audio" && (
            <motion.div key="audio" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
              {audio.map((item, i) => {
                const isSoundCloud = item.url.includes("soundcloud.com");
                const isSpotify = item.url.includes("spotify.com");

                return (
                  <FadeIn key={item.id} delay={i * 0.06}>
                    <CardShell className="p-5 overflow-hidden">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center shrink-0">
                          <Headphones className="w-5 h-5 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                          {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                          {item.category && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Audio Player */}
                      {isSoundCloud && (
                        <iframe
                          width="100%"
                          height="120"
                          allow="autoplay"
                          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&color=%2310B981&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                          className="rounded-xl border border-border"
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                      {isSpotify && (
                        <iframe
                          src={`https://open.spotify.com/embed${new URL(item.url).pathname}`}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          className="rounded-xl border border-border"
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                      {!isSoundCloud && !isSpotify && (
                        <audio controls className="w-full mt-1 rounded-lg" style={{ height: "40px" }}>
                          <source src={item.url} />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </CardShell>
                  </FadeIn>
                );
              })}
              {audio.length === 0 && <EmptyState icon={Headphones} message="No audio items yet." />}
            </motion.div>
          )}

          {/* ─── Video Tab ─── */}
          {activeTab === "video" && (
            <motion.div key="video" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videoItems.map((item, i) => {
                const ytId = parseYouTubeId(item.url);
                const vimeoId = parseVimeoId(item.url);
                const isDirect = !ytId && !vimeoId;

                return (
                  <FadeIn key={item.id} delay={i * 0.06}>
                    <CardShell className="overflow-hidden h-full flex flex-col">
                      {/* Video embed */}
                      <div className="aspect-video bg-muted/30">
                        {ytId && (
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        )}
                        {vimeoId && (
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}`}
                            title={item.title}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        )}
                        {isDirect && (
                          <video controls className="w-full h-full object-contain bg-black">
                            <source src={item.url} />
                            Your browser does not support the video element.
                          </video>
                        )}
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Play className="w-4 h-4 text-emerald" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                            {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                            {item.category && (
                              <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardShell>
                  </FadeIn>
                );
              })}
              {videoItems.length === 0 && (
                <div className="col-span-full">
                  <EmptyState icon={Video} message="No video items yet." />
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Notes Tab ─── */}
          {activeTab === "notes" && (
            <motion.div key="notes" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-3">
              {notes.map((note, i) => (
                <FadeIn key={note.id} delay={i * 0.05}>
                  <CardShell className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                        <StickyNote className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{note.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{note.content}</p>
                        {note.date && <span className="text-[10px] text-muted-foreground mt-2 block">{note.date}</span>}
                      </div>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
              {notes.length === 0 && <EmptyState icon={StickyNote} message="No notes yet." />}
            </motion.div>
          )}

          {/* ─── Quotes Tab ─── */}
          {activeTab === "quotes" && (
            <motion.div key="quotes" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-3">
              {quotes.map((q, i) => (
                <FadeIn key={q.id} delay={i * 0.05}>
                  <CardShell className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Quote className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                        {q.context && <span className="text-[10px] text-emerald font-medium mt-2 block">&mdash; {q.context}</span>}
                      </div>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
              {quotes.length === 0 && <EmptyState icon={Quote} message="No quotes yet." />}
            </motion.div>
          )}

          {/* ─── Codes Tab ─── */}
          {activeTab === "codes" && (
            <motion.div key="codes" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-4">
              {codeItems.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.06}>
                  <CardShell className="overflow-hidden">
                    <div className="p-4 pb-3 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Code2 className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                        {item.language && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">
                            {item.language}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-border">
                      <pre className="bg-zinc-900 text-zinc-100 text-xs leading-relaxed p-4 overflow-x-auto max-h-96" style={{ scrollbarWidth: "thin" }}>
                        <code>{item.content}</code>
                      </pre>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
              {codeItems.length === 0 && <EmptyState icon={Code2} message="No code snippets yet." />}
            </motion.div>
          )}

          {/* ─── Links Tab ─── */}
          {activeTab === "links" && (
            <motion.div key="links" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-3">
              {links.map((link, i) => (
                <FadeIn key={link.id} delay={i * 0.05}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <CardShell className="p-4 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-emerald/20 transition-colors">
                          <Link2 className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald transition-colors">{link.title}</h3>
                          {link.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{link.description}</p>}
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald transition-colors shrink-0" />
                      </div>
                      {link.category && (
                        <span className="inline-block mt-2 ml-12 px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">
                          {link.category}
                        </span>
                      )}
                    </CardShell>
                  </a>
                </FadeIn>
              ))}
              {links.length === 0 && <EmptyState icon={Link2} message="No links yet." />}
            </motion.div>
          )}

          {/* ─── Guestbook Tab ─── */}
          {activeTab === "guestbook" && (
            <motion.div key="guestbook" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
              {/* Form */}
              <FadeIn>
                <CardShell className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-emerald" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Leave a Message</h3>
                  </div>

                  {gbSuccess && (
                    <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald/10 border border-emerald/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                      <p className="text-sm text-emerald font-medium">Thank you! Your message has been posted.</p>
                    </div>
                  )}

                  <form onSubmit={handleGuestbookSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={gbName}
                          onChange={(e) => setGbName(e.target.value)}
                          required
                          placeholder="Your name"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={gbLocation}
                          onChange={(e) => setGbLocation(e.target.value)}
                          required
                          placeholder="City, Country"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Email (optional)</label>
                        <input
                          type="email"
                          value={gbEmail}
                          onChange={(e) => setGbEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Phone (optional)</label>
                        <input
                          type="tel"
                          value={gbPhone}
                          onChange={(e) => setGbPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Message (optional)</label>
                      <textarea
                        value={gbMessage}
                        onChange={(e) => setGbMessage(e.target.value)}
                        placeholder="Say something nice..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={gbSubmitting || !gbName.trim() || !gbLocation.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {gbSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post Message
                        </>
                      )}
                    </button>
                  </form>
                </CardShell>
              </FadeIn>

              {/* Entries */}
              <div className="space-y-3">
                {guestbookEntries.map((entry, i) => (
                  <FadeIn key={entry.id} delay={i * 0.04}>
                    <CardShell className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-emerald">{entry.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                            <h4 className="text-sm font-semibold text-foreground">{entry.name}</h4>
                            <span className="text-[10px] text-muted-foreground">{formatDate(entry.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{entry.location}</span>
                          </div>
                          {entry.message && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{entry.message}</p>}
                        </div>
                      </div>
                    </CardShell>
                  </FadeIn>
                ))}
                {guestbookEntries.length === 0 && <EmptyState icon={MessageSquare} message="No guestbook entries yet. Be the first!" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightbox !== null && galleryImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium">
                {lightbox + 1} / {galleryImages.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </footer>

      {/* ─── Back to top ─── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald text-white shadow-lg flex items-center justify-center hover:bg-emerald-hover transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
