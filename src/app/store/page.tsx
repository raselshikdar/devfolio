"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Menu,
  X,
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

/* ─── Data ─── */

const ALL_PRODUCTS = [
  {
    name: "UI Component Kit",
    price: "$29",
    priceNum: 29,
    image: "https://picsum.photos/seed/store1/400/260",
    description: "50+ premium React components with dark mode support, fully customizable with Tailwind CSS.",
    category: "Components",
    rating: 4.8,
  },
  {
    name: "React Hooks Handbook",
    price: "$19",
    priceNum: 19,
    image: "https://picsum.photos/seed/store2/400/260",
    description: "Comprehensive guide to 30+ custom React hooks with practical examples and best practices.",
    category: "Books",
    rating: 4.9,
  },
  {
    name: "Design System Template",
    price: "$39",
    priceNum: 39,
    image: "https://picsum.photos/seed/store3/400/260",
    description: "Complete Figma design system with 200+ components, auto-layout, and design tokens.",
    category: "Design",
    rating: 4.7,
  },
  {
    name: "Next.js Starter Kit",
    price: "$34",
    priceNum: 34,
    image: "https://picsum.photos/seed/store4/400/260",
    description: "Production-ready Next.js boilerplate with auth, database, payments, and CI/CD pipeline.",
    category: "Templates",
    rating: 4.6,
  },
  {
    name: "API Design Patterns",
    price: "$24",
    priceNum: 24,
    image: "https://picsum.photos/seed/store5/400/260",
    description: "E-book covering REST, GraphQL, and tRPC patterns with TypeScript examples and testing strategies.",
    category: "Books",
    rating: 4.5,
  },
  {
    name: "Icon Pack Pro",
    price: "$15",
    priceNum: 15,
    image: "https://picsum.photos/seed/store6/400/260",
    description: "500+ hand-crafted SVG icons in 4 styles — line, solid, duotone, and thin. Figma plugin included.",
    category: "Design",
    rating: 4.8,
  },
  {
    name: "Tailwind Dashboard Kit",
    price: "$45",
    priceNum: 45,
    image: "https://picsum.photos/seed/store7/400/260",
    description: "Admin dashboard template with 40+ pages, charts, tables, and authentication flows.",
    category: "Templates",
    rating: 4.9,
  },
  {
    name: "CSS Animation Library",
    price: "$22",
    priceNum: 22,
    image: "https://picsum.photos/seed/store8/400/260",
    description: "80+ copy-paste CSS animations with React hooks integration. Zero dependencies, 3KB gzipped.",
    category: "Components",
    rating: 4.7,
  },
  {
    name: "TypeScript Cheat Sheet",
    price: "$9",
    priceNum: 9,
    image: "https://picsum.photos/seed/store9/400/260",
    description: "Printable reference card covering advanced TypeScript patterns, utility types, and best practices.",
    category: "Books",
    rating: 4.4,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.category)))];

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

  let filtered = ALL_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.priceNum - b.priceNum);
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.priceNum - a.priceNum);
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

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
            <Link href="/#store" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Store</h1>
              <p className="text-xs text-muted-foreground">{ALL_PRODUCTS.length} digital products &amp; resources</p>
            </div>
          </div>
        </FadeIn>

        {/* Search + filters */}
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
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
              {(["default", "price-low", "price-high", "rating"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                    sortBy === s ? "bg-emerald text-white" : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                  }`}
                >
                  {s === "default" ? "Default" : s === "price-low" ? "Price: Low" : s === "price-high" ? "Price: High" : "Top Rated"}
                </button>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.06}>
              <CardShell className="overflow-hidden">
                <div className="aspect-[4/2.6] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                    <span className="text-sm text-emerald font-bold shrink-0">{item.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] text-muted-foreground font-medium">{item.rating}</span>
                      <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground bg-muted rounded ml-1">{item.category}</span>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </CardShell>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </main>

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
