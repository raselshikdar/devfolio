"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  ShoppingCart,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  Filter,
} from "lucide-react";

/* ─── Types ─── */

interface StoreProduct {
  id: string;
  name: string;
  price: string;
  image?: string | null;
  featuredImage?: string | null;
  description?: string | null;
  category?: string | null;
  rating?: number | null;
}

/* ─── Fallback Data ─── */

const FALLBACK_PRODUCTS: StoreProduct[] = [
  {
    id: "st1",
    name: "UI Component Kit",
    price: "$29",
    image: "https://picsum.photos/seed/store1/400/260",
    featuredImage: "",
    description: "50+ premium React components with dark mode support, fully customizable with Tailwind CSS.",
    category: "Components",
    rating: 4.8,
  },
  {
    id: "st2",
    name: "React Hooks Handbook",
    price: "$19",
    image: "https://picsum.photos/seed/store2/400/260",
    featuredImage: "",
    description: "Comprehensive guide to 30+ custom React hooks with practical examples and best practices.",
    category: "Books",
    rating: 4.9,
  },
  {
    id: "st3",
    name: "Design System Template",
    price: "$39",
    image: "https://picsum.photos/seed/store3/400/260",
    featuredImage: "",
    description: "Complete Figma design system with 200+ components, auto-layout, and design tokens.",
    category: "Design",
    rating: 4.7,
  },
  {
    id: "st4",
    name: "Next.js Starter Kit",
    price: "$34",
    image: "https://picsum.photos/seed/store4/400/260",
    featuredImage: "",
    description: "Production-ready Next.js boilerplate with auth, database, payments, and CI/CD pipeline.",
    category: "Templates",
    rating: 4.6,
  },
  {
    id: "st5",
    name: "API Design Patterns",
    price: "$24",
    image: "https://picsum.photos/seed/store5/400/260",
    featuredImage: "",
    description: "E-book covering REST, GraphQL, and tRPC patterns with TypeScript examples and testing strategies.",
    category: "Books",
    rating: 4.5,
  },
  {
    id: "st6",
    name: "Icon Pack Pro",
    price: "$15",
    image: "https://picsum.photos/seed/store6/400/260",
    featuredImage: "",
    description: "500+ hand-crafted SVG icons in 4 styles — line, solid, duotone, and thin. Figma plugin included.",
    category: "Design",
    rating: 4.8,
  },
  {
    id: "st7",
    name: "Tailwind Dashboard Kit",
    price: "$45",
    image: "https://picsum.photos/seed/store7/400/260",
    featuredImage: "",
    description: "Admin dashboard template with 40+ pages, charts, tables, and authentication flows.",
    category: "Templates",
    rating: 4.9,
  },
  {
    id: "st8",
    name: "CSS Animation Library",
    price: "$22",
    image: "https://picsum.photos/seed/store8/400/260",
    featuredImage: "",
    description: "80+ copy-paste CSS animations with React hooks integration. Zero dependencies, 3KB gzipped.",
    category: "Components",
    rating: 4.7,
  },
  {
    id: "st9",
    name: "TypeScript Cheat Sheet",
    price: "$9",
    image: "https://picsum.photos/seed/store9/400/260",
    featuredImage: "",
    description: "Printable reference card covering advanced TypeScript patterns, utility types, and best practices.",
    category: "Books",
    rating: 4.4,
  },
];

/* ─── Helpers ─── */

function resolveImage(item: { featuredImage?: string | null; image?: string | null }): string {
  return item.featuredImage || item.image || "";
}

function parsePrice(price: string): number {
  const match = price.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 text-emerald fill-emerald" />
      ))}
      {hasHalf && (
        <div className="relative w-3 h-3">
          <Star className="w-3 h-3 text-muted-foreground/30 absolute" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3 h-3 text-emerald fill-emerald" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-muted-foreground/30" />
      ))}
    </div>
  );
}

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

export default function StorePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  /* ─── Mount ─── */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  /* ─── Fetch API data ─── */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) return;
        const data = await res.json();
        if (data.storeProducts?.length) setProducts(data.storeProducts);
      } catch {
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ─── Scroll listener ─── */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Derived: categories ─── */
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])),
  ];

  /* ─── Derived: filtered & sorted ─── */
  let filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/#store"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to store section"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                <span className="text-emerald">S</span>tore
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                {products.length} digital products &amp; resources
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── Back link + heading ─── */}
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Products</h2>
              <p className="text-xs text-muted-foreground">
                Premium digital resources for developers &amp; designers
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ─── Search + filters ─── */}
        <FadeIn>
          <CardShell className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                {categories.map((cat) => (
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
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
              {(["default", "price-low", "price-high", "rating"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                    sortBy === s
                      ? "bg-emerald text-white"
                      : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                  }`}
                >
                  {s === "default" ? "Default" : s === "price-low" ? "Price: Low" : s === "price-high" ? "Price: High" : "Top Rated"}
                </button>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Loading skeleton ─── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card animate-pulse overflow-hidden"
              >
                <div className="aspect-[4/2.6] bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      <div className="h-3 w-3 bg-muted rounded" />
                      <div className="h-3 w-3 bg-muted rounded" />
                      <div className="h-3 w-3 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Product grid ─── */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => {
              const imgSrc = resolveImage(item);
              return (
                <FadeIn key={item.id} delay={i * 0.06}>
                  <CardShell className="overflow-hidden h-full flex flex-col">
                    {/* Featured image */}
                    {imgSrc && (
                      <div className="aspect-[4/2.6] overflow-hidden relative group">
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Category badge on image */}
                        {item.category && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald/90 backdrop-blur-sm rounded-md">
                            {item.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-1">
                      {/* Title + Price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        <span className="text-sm text-emerald font-bold shrink-0">{item.price}</span>
                      </div>

                      {/* Description (2-line clamp) */}
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Rating + Category + Buy Now */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          {item.rating != null && (
                            <>
                              <StarRating rating={item.rating} />
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {item.rating.toFixed(1)}
                              </span>
                            </>
                          )}
                          {!imgSrc && item.category && (
                            <span className="px-1.5 py-0.5 text-[10px] text-emerald bg-emerald/10 rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </CardShell>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* ─── Empty state ─── */}
        {!loading && filtered.length === 0 && (
          <FadeIn>
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-emerald/40" />
              </div>
              <p className="text-sm font-medium text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-emerald text-white hover:bg-emerald-hover transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </FadeIn>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Alex Morgan. All rights reserved.
        </div>
      </footer>

      {/* ─── Back to top ─── */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald text-white shadow-lg flex items-center justify-center hover:bg-emerald-hover transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
