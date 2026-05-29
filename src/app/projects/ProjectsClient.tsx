"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  ExternalLink,
  Github,
  Star,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Folder,
  ChevronRight,
} from "lucide-react";

/* ─── Types ─── */

interface Project {
  id: string;
  name: string;
  description: string;
  image: string | null;
  featuredImage: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  tags: string | null;
  category: string | null;
  featured: boolean;
}

/* ─── Fallback Data ─── */

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "TaskFlow",
    description: "AI-powered project management platform with real-time collaboration and intelligent task prioritization for distributed teams.",
    image: "https://picsum.photos/seed/proj1/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Next.js,OpenAI,Socket.io",
    category: "Web App",
    featured: true,
  },
  {
    id: "p2",
    name: "FinTrack",
    description: "Personal finance dashboard with smart budgeting, expense analytics, and automated savings recommendations.",
    image: "https://picsum.photos/seed/proj2/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "React,D3.js,Node.js",
    category: "Dashboard",
    featured: true,
  },
  {
    id: "p3",
    name: "DevChat",
    description: "Real-time messaging app for developer teams with syntax-highlighted code snippets and thread conversations.",
    image: "https://picsum.photos/seed/proj3/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "TypeScript,WebSocket,Redis",
    category: "Communication",
    featured: true,
  },
  {
    id: "p4",
    name: "EcoMarket",
    description: "Sustainable e-commerce platform with carbon footprint tracking, green vendor ratings, and eco-friendly packaging options.",
    image: "https://picsum.photos/seed/proj4/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Next.js,Stripe,Prisma",
    category: "E-Commerce",
    featured: true,
  },
  {
    id: "p5",
    name: "MediScan",
    description: "Health monitoring app with ML-powered symptom analysis, medication reminders, and telehealth integration.",
    image: "https://picsum.photos/seed/proj5/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Python,TensorFlow,React",
    category: "Health",
    featured: false,
  },
  {
    id: "p6",
    name: "LearnHub",
    description: "Online learning platform with interactive coding challenges, progress tracking, and peer-to-peer mentoring.",
    image: "https://picsum.photos/seed/proj6/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Next.js,Monaco,PostgreSQL",
    category: "Education",
    featured: false,
  },
  {
    id: "p7",
    name: "CloudDeploy",
    description: "One-click deployment CLI tool for containerized applications with built-in monitoring and rollback support.",
    image: "https://picsum.photos/seed/proj7/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Go,Docker,Kubernetes",
    category: "DevOps",
    featured: false,
  },
  {
    id: "p8",
    name: "PixelForge",
    description: "Browser-based image editor with AI-powered background removal, smart filters, and batch processing.",
    image: "https://picsum.photos/seed/proj8/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "Canvas API,WebAssembly,Python",
    category: "Creative",
    featured: false,
  },
  {
    id: "p9",
    name: "DataPulse",
    description: "Real-time analytics dashboard with customizable widgets, alert thresholds, and multi-source data connectors.",
    image: "https://picsum.photos/seed/proj9/600/340",
    featuredImage: "",
    demoUrl: "#",
    githubUrl: "#",
    tags: "React,GraphQL,Apache Kafka",
    category: "Dashboard",
    featured: false,
  },
];

/* ─── Helpers ─── */

function splitTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function resolveImage(project: {
  featuredImage?: string | null;
  image?: string | null;
}): string {
  return project.featuredImage || project.image || "";
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

export default function ProjectsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Rasel Shikdar");

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
        if (data.projects?.length) setProjects(data.projects);
        if (data.profile?.name) setProfileName(data.profile.name);
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

  /* ─── Derived ─── */
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[],
  ];

  // Sort: featured projects first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const featuredProject = sortedProjects.find((p) => p.featured);

  const filtered = sortedProjects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // In the grid, exclude the featured project if it's shown in the featured section
  const gridProjects = filtered.filter(
    (p) => !(featuredProject && p.id === featuredProject.id)
  );

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/#projects"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                <span className="text-emerald">P</span>rojects
              </h1>
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
              <Folder className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All Projects
              </h2>
              <p className="text-xs text-muted-foreground">
                {projects.length} projects built with passion
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ─── Search + Filter ─── */}
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
          </CardShell>
        </FadeIn>

        {/* ─── Featured Project Section ─── */}
        {featuredProject && (
          <FadeIn>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-emerald fill-emerald" />
                <h2 className="text-sm font-semibold text-foreground">Featured Project</h2>
              </div>
              <Link href={`/projects/${featuredProject.id}`}>
                <CardShell className="overflow-hidden cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {resolveImage(featuredProject) && (
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img
                          src={resolveImage(featuredProject)}
                          alt={featuredProject.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald/10 text-emerald">
                          <Star className="w-2.5 h-2.5" /> Featured
                        </span>
                        {featuredProject.category && (
                          <span className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">
                            {featuredProject.category}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                        {featuredProject.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {featuredProject.description}
                      </p>
                      {/* Tags */}
                      {splitTags(featuredProject.tags).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {splitTags(featuredProject.tags).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline">
                          View Details <ChevronRight className="w-3 h-3" />
                        </span>
                        {featuredProject.demoUrl && (
                          <a
                            href={featuredProject.demoUrl}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" /> Live Demo
                          </a>
                        )}
                        {featuredProject.githubUrl && (
                          <a
                            href={featuredProject.githubUrl}
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-3 h-3" /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardShell>
              </Link>
            </div>
          </FadeIn>
        )}

        {/* ─── Loading skeleton ─── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card animate-pulse overflow-hidden"
              >
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 bg-muted rounded-md" />
                    <div className="h-5 w-14 bg-muted rounded-md" />
                    <div className="h-5 w-14 bg-muted rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Projects grid ─── */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridProjects.map((p, i) => {
              const imgSrc = resolveImage(p);
              const tags = splitTags(p.tags);
              return (
                <FadeIn key={p.id} delay={i * 0.06}>
                  <Link href={`/projects/${p.id}`}>
                    <CardShell className="overflow-hidden h-full flex flex-col cursor-pointer">
                      {/* Featured image */}
                      {imgSrc && (
                        <div className="aspect-[16/9] overflow-hidden relative group">
                          <img
                            src={imgSrc}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          {/* Featured badge */}
                          {p.featured && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald rounded-md flex items-center gap-1">
                              <Star className="w-3 h-3" /> Featured
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        {/* Category badge + title */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {p.name}
                          </h3>
                          {p.category && (
                            <span className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md whitespace-nowrap shrink-0">
                              {p.category}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground mt-1.5 flex-1">
                          {p.description}
                        </p>

                        {/* Tags as emerald pills */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Demo + GitHub links */}
                        <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                          {p.demoUrl && (
                            <a
                              href={p.demoUrl}
                              className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-3 h-3" /> GitHub
                            </a>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline ml-auto">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </CardShell>
                  </Link>
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
                <Star className="w-8 h-8 text-emerald/40" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No projects found
              </p>
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
          &copy; {new Date().getFullYear()} {profileName}. All rights reserved.
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
