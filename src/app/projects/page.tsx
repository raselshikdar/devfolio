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
  ExternalLink,
  Github,
  Star,
  ArrowLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";

/* ─── Data ─── */

const ALL_PROJECTS = [
  {
    name: "TaskFlow",
    description: "AI-powered project management platform with real-time collaboration and intelligent task prioritization for distributed teams.",
    tags: ["Next.js", "OpenAI", "Socket.io"],
    demo: "#",
    github: "#",
    category: "Web App",
  },
  {
    name: "FinTrack",
    description: "Personal finance dashboard with smart budgeting, expense analytics, and automated savings recommendations.",
    tags: ["React", "D3.js", "Node.js"],
    demo: "#",
    github: "#",
    category: "Dashboard",
  },
  {
    name: "DevChat",
    description: "Real-time messaging app for developer teams with syntax-highlighted code snippets and thread conversations.",
    tags: ["TypeScript", "WebSocket", "Redis"],
    demo: "#",
    github: "#",
    category: "Communication",
  },
  {
    name: "EcoMarket",
    description: "Sustainable e-commerce platform with carbon footprint tracking, green vendor ratings, and eco-friendly packaging options.",
    tags: ["Next.js", "Stripe", "Prisma"],
    demo: "#",
    github: "#",
    category: "E-Commerce",
  },
  {
    name: "MediScan",
    description: "Health monitoring app with ML-powered symptom analysis, medication reminders, and telehealth integration.",
    tags: ["Python", "TensorFlow", "React"],
    demo: "#",
    github: "#",
    category: "Health",
  },
  {
    name: "LearnHub",
    description: "Online learning platform with interactive coding challenges, progress tracking, and peer-to-peer mentoring.",
    tags: ["Next.js", "Monaco", "PostgreSQL"],
    demo: "#",
    github: "#",
    category: "Education",
  },
  {
    name: "CloudDeploy",
    description: "One-click deployment CLI tool for containerized applications with built-in monitoring and rollback support.",
    tags: ["Go", "Docker", "Kubernetes"],
    demo: "#",
    github: "#",
    category: "DevOps",
  },
  {
    name: "PixelForge",
    description: "Browser-based image editor with AI-powered background removal, smart filters, and batch processing.",
    tags: ["Canvas API", "WebAssembly", "Python"],
    demo: "#",
    github: "#",
    category: "Creative",
  },
  {
    name: "DataPulse",
    description: "Real-time analytics dashboard with customizable widgets, alert thresholds, and multi-source data connectors.",
    tags: ["React", "GraphQL", "Apache Kafka"],
    demo: "#",
    github: "#",
    category: "Dashboard",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_PROJECTS.map((p) => p.category)))];

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

export default function ProjectsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
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

  const filtered = ALL_PROJECTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
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
        {/* Back link + heading */}
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/#projects" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Projects</h1>
              <p className="text-xs text-muted-foreground">{ALL_PROJECTS.length} projects built with passion</p>
            </div>
          </div>
        </FadeIn>

        {/* Search + Filter */}
        <FadeIn>
          <CardShell className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
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
          </CardShell>
        </FadeIn>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.06}>
              <CardShell className="p-5 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md whitespace-nowrap">{p.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted rounded-md">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                  <a href={p.demo} className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline">
                    <ExternalLink className="w-3 h-3" /> Live Demo
                  </a>
                  <a href={p.github} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald transition-colors">
                    <Github className="w-3 h-3" /> GitHub
                  </a>
                </div>
              </CardShell>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No projects found matching your search.</p>
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
