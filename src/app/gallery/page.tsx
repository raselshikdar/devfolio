"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUp,
  Image as ImageIcon,
  ArrowLeft,
  Grid3X3,
  LayoutGrid,
  X as CloseIcon,
} from "lucide-react";

/* ─── Data ─── */

const ALL_GALLERY = [
  { src: "https://picsum.photos/seed/gallery01/600/400", alt: "Mountain landscape at sunset", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery02/600/400", alt: "Urban city skyline", category: "Urban" },
  { src: "https://picsum.photos/seed/gallery03/600/400", alt: "Ocean waves crashing", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery04/600/400", alt: "Forest trail in autumn", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery05/600/400", alt: "Desert sand dunes", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery06/600/400", alt: "Northern lights display", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery07/600/400", alt: "Tropical beach paradise", category: "Travel" },
  { src: "https://picsum.photos/seed/gallery08/600/400", alt: "Snowy mountain peaks", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery09/600/400", alt: "Modern architecture detail", category: "Urban" },
  { src: "https://picsum.photos/seed/gallery10/600/400", alt: "Street photography at night", category: "Urban" },
  { src: "https://picsum.photos/seed/gallery11/600/400", alt: "Cherry blossom garden", category: "Nature" },
  { src: "https://picsum.photos/seed/gallery12/600/400", alt: "Historic European cathedral", category: "Travel" },
  { src: "https://picsum.photos/seed/gallery13/600/400", alt: "Workspace and technology", category: "Workspace" },
  { src: "https://picsum.photos/seed/gallery14/600/400", alt: "Coffee and code setup", category: "Workspace" },
  { src: "https://picsum.photos/seed/gallery15/600/400", alt: "Minimalist desk setup", category: "Workspace" },
  { src: "https://picsum.photos/seed/gallery16/600/400", alt: "Night city reflections", category: "Urban" },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_GALLERY.map((g) => g.category)))];

/* ─── Components ─── */

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

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-sm transition-colors duration-200 hover:border-emerald ${className}`}>
      {children}
    </div>
  );
}

/* ─── Page ─── */

export default function GalleryPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [columns, setColumns] = useState<3 | 4>(4);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCategory === "All" ? ALL_GALLERY : ALL_GALLERY.filter((g) => g.category === activeCategory);
  const gridCols = columns === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3";

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
            <span className="text-emerald">A</span>lex<span className="text-emerald">.</span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors">
                {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              </button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors" aria-label="Menu">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Back + heading */}
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/#gallery" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
              <p className="text-xs text-muted-foreground">{ALL_GALLERY.length} photos &amp; visuals</p>
            </div>
          </div>
        </FadeIn>

        {/* Filters + layout toggle */}
        <FadeIn>
          <CardShell className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? "bg-emerald text-white"
                        : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setColumns(3)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${columns === 3 ? "bg-emerald/10 text-emerald" : "text-muted-foreground hover:text-emerald"}`}
                  aria-label="3 columns"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setColumns(4)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${columns === 4 ? "bg-emerald/10 text-emerald" : "text-muted-foreground hover:text-emerald"}`}
                  aria-label="4 columns"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* Image grid */}
        <div className={`grid ${gridCols} gap-3`}>
          {filtered.map((img, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <button
                onClick={() => setLightbox(img.src)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-emerald transition-colors cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm rounded-md">
                  {img.category}
                </span>
              </button>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No images in this category.</p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Alex Morgan. All rights reserved.
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald text-white shadow-lg flex items-center justify-center hover:bg-emerald-hover transition-colors">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
