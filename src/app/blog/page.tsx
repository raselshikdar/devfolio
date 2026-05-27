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
  FileText,
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Tag,
} from "lucide-react";

/* ─── Data ─── */

const ALL_POSTS = [
  {
    title: "Building Scalable APIs with Next.js Server Actions",
    date: "May 15, 2026",
    readTime: "8 min",
    excerpt: "A deep dive into leveraging server actions for type-safe, performant API design. Learn how to eliminate boilerplate and improve developer experience with this modern approach to full-stack development.",
    tags: ["Next.js", "API", "Server Actions"],
    link: "#",
  },
  {
    title: "The Future of CSS: What's Coming in 2027",
    date: "Apr 28, 2026",
    readTime: "6 min",
    excerpt: "Exploring upcoming CSS features that will transform how we build interfaces. From native nesting to container queries, the future of styling looks brighter than ever.",
    tags: ["CSS", "Frontend", "Design"],
    link: "#",
  },
  {
    title: "Why I Switched from Redux to Zustand",
    date: "Apr 10, 2026",
    readTime: "5 min",
    excerpt: "My journey simplifying state management with a lighter, more intuitive library. Comparing boilerplate, performance, and developer experience between the two approaches.",
    tags: ["React", "State Management", "Zustand"],
    link: "#",
  },
  {
    title: "Mastering TypeScript Generics: A Practical Guide",
    date: "Mar 22, 2026",
    readTime: "10 min",
    excerpt: "Demystifying TypeScript generics with real-world examples. From basic constraints to conditional types, learn patterns that will level up your type-safe code.",
    tags: ["TypeScript", "Generics", "Programming"],
    link: "#",
  },
  {
    title: "Docker for Frontend Developers: Getting Started",
    date: "Mar 05, 2026",
    readTime: "7 min",
    excerpt: "A beginner-friendly guide to containerizing your frontend applications. Set up reproducible dev environments and streamline your deployment workflow with Docker.",
    tags: ["Docker", "DevOps", "Frontend"],
    link: "#",
  },
  {
    title: "Designing Accessible UIs: Beyond Compliance",
    date: "Feb 18, 2026",
    readTime: "9 min",
    excerpt: "Accessibility is more than checking boxes. Learn how to create interfaces that are genuinely usable by everyone, with practical patterns and testing strategies.",
    tags: ["Accessibility", "Design", "UX"],
    link: "#",
  },
  {
    title: "React Server Components: A Deep Comparison",
    date: "Jan 30, 2026",
    readTime: "12 min",
    excerpt: "Comparing RSC patterns with traditional SPA approaches. When to use server components, when to stay client-side, and how to make the most of both worlds.",
    tags: ["React", "RSC", "Performance"],
    link: "#",
  },
  {
    title: "My 2026 Developer Toolkit: Tools I Can't Live Without",
    date: "Jan 12, 2026",
    readTime: "4 min",
    excerpt: "A curated list of tools, extensions, and workflows that supercharge my daily development. From editor plugins to CLI utilities that save hours every week.",
    tags: ["Productivity", "Tools", "Developer Experience"],
    link: "#",
  },
];

const ALL_TAGS = Array.from(new Set(ALL_POSTS.flatMap((p) => p.tags)));

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

export default function BlogPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
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

  const filtered = ALL_POSTS.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

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
            <Link href="/#blog" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blog</h1>
              <p className="text-xs text-muted-foreground">{ALL_POSTS.length} articles on development &amp; design</p>
            </div>
          </div>
        </FadeIn>

        {/* Search + tags */}
        <FadeIn>
          <CardShell className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    !activeTag ? "bg-emerald text-white" : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                  }`}
                >
                  All
                </button>
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      activeTag === tag ? "bg-emerald text-white" : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* Blog list */}
        <div className="space-y-4">
          {filtered.map((post, i) => (
            <FadeIn key={post.title} delay={i * 0.06}>
              <CardShell className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {post.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">{t}</span>
                      ))}
                    </div>
                  </div>
                  <a href={post.link} className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline whitespace-nowrap mt-2 sm:mt-0">
                    Read More <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </CardShell>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No articles found matching your search.</p>
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
