"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowLeft,
  ShoppingCart,
  Star,
  ExternalLink,
  Tag,
  DollarSign,
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
  buyUrl?: string | null;
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

function resolveImage(item: {
  featuredImage?: string | null;
  image?: string | null;
}): string {
  return item.featuredImage || item.image || "";
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-emerald fill-emerald" />
      ))}
      {hasHalf && (
        <div className="relative w-4 h-4">
          <Star className="w-4 h-4 text-muted-foreground/30 absolute" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-4 h-4 text-emerald fill-emerald" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
      ))}
    </div>
  );
}

/* ─── Components ─── */

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-sm transition-colors duration-200 hover:border-emerald ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Page ─── */

export default function StoreDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
        if (data.storeProducts?.length) setProducts(data.storeProducts);
      } catch {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Derived ─── */
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!loading && !product) setNotFound(true);
    if (product) setNotFound(false);
  }, [loading, product]);

  const heroImage = product ? resolveImage(product) : "";

  /* Related products: same category first, then latest, exclude current */
  const relatedProducts = product
    ? products
        .filter((p) => p.id !== product.id)
        .sort((a, b) => {
          const aMatch = a.category === product.category ? 1 : 0;
          const bMatch = b.category === product.category ? 1 : 0;
          return bMatch - aMatch;
        })
        .slice(0, 3)
    : [];

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className="dot-pattern min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ─── Not found state ─── */
  if (notFound) {
    return (
      <div className="dot-pattern min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
          <nav className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
            <Link
              href="/store"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div />
          </nav>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-emerald/40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Product Not Found</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald text-white hover:bg-emerald-hover transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
          </div>
        </main>
        <footer className="border-t border-border mt-6">
          <div className="max-w-4xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Alex Morgan. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/store"
              className="w-9 h-9 shrink-0 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to store"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {product?.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── Product Hero ─── */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={product!.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/30">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              {product!.category && (
                <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold text-white bg-emerald/90 backdrop-blur-sm rounded-lg">
                  {product!.category}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {product!.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald" />
                <span className="text-3xl font-bold text-emerald">
                  {product!.price}
                </span>
              </div>

              {/* Rating */}
              {product!.rating != null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={product!.rating} />
                  <span className="text-sm text-muted-foreground font-medium">
                    {product!.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Category Badge */}
              {product!.category && (
                <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 text-xs font-semibold rounded-lg bg-emerald/10 text-emerald">
                  <Tag className="w-3 h-3" />
                  {product!.category}
                </span>
              )}

              {/* Buy Now Button */}
              {product!.buyUrl ? (
                <a
                  href={product!.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors w-fit"
                >
                  <ShoppingCart className="w-4 h-4" /> Buy Now
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors w-fit">
                  <ShoppingCart className="w-4 h-4" /> Buy Now
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* ─── Description ─── */}
        <FadeIn delay={0.15}>
          <CardShell className="p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product!.description || "No description available for this product."}
            </p>
          </CardShell>
        </FadeIn>

        {/* ─── Product Details Card ─── */}
        <FadeIn delay={0.2}>
          <CardShell className="p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-4">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Price */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Price</p>
                <p className="text-sm font-bold text-emerald">{product!.price}</p>
              </div>
              {/* Category */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-foreground">
                  {product!.category || "Uncategorized"}
                </p>
              </div>
              {/* Rating */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Rating</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald fill-emerald" />
                  <span className="text-sm font-semibold text-foreground">
                    {product!.rating != null ? product!.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <FadeIn delay={0.3}>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Related Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rp, i) => {
                  const rpImage = resolveImage(rp);
                  return (
                    <FadeIn key={rp.id} delay={0.35 + i * 0.06}>
                      <Link href={`/store/${rp.id}`}>
                        <CardShell className="overflow-hidden h-full flex flex-col">
                          {rpImage ? (
                            <div className="aspect-[4/2.6] overflow-hidden relative group">
                              <img
                                src={rpImage}
                                alt={rp.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              {rp.category && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald/90 backdrop-blur-sm rounded-md">
                                  {rp.category}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-[4/2.6] bg-muted/30 flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-foreground">
                                {rp.name}
                              </h4>
                              <span className="text-xs text-emerald font-bold shrink-0">
                                {rp.price}
                              </span>
                            </div>
                            {rp.description && (
                              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                                {rp.description}
                              </p>
                            )}
                            {rp.rating != null && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: Math.floor(rp.rating) }).map((_, si) => (
                                    <Star key={si} className="w-3 h-3 text-emerald fill-emerald" />
                                  ))}
                                  {Array.from({ length: 5 - Math.floor(rp.rating) }).map((_, si) => (
                                    <Star key={`e-${si}`} className="w-3 h-3 text-muted-foreground/30" />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {rp.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardShell>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-4xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
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
