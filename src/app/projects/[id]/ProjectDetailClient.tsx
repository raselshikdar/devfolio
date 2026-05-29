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
  ExternalLink,
  Github,
  Star,
  Folder,
  Globe,
  Code2,
  Tag,
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

export default function ProjectDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
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
        if (data.projects?.length) setProjects(data.projects);
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
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (!loading && !project) setNotFound(true);
    if (project) setNotFound(false);
  }, [loading, project]);

  const projectTags = splitTags(project?.tags);
  const heroImage = project ? resolveImage(project) : "";

  /* Related projects: same category first, then latest, exclude current */
  const relatedProjects = project
    ? projects
        .filter((p) => p.id !== project.id)
        .sort((a, b) => {
          const aMatch = a.category === project.category ? 1 : 0;
          const bMatch = b.category === project.category ? 1 : 0;
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
          <p className="text-sm text-muted-foreground">Loading project...</p>
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
              href="/projects"
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
              <Folder className="w-8 h-8 text-emerald/40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Project Not Found</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald text-white hover:bg-emerald-hover transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
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
              href="/projects"
              className="w-9 h-9 shrink-0 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {project?.name}
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
        {/* ─── Hero Image ─── */}
        {heroImage && (
          <FadeIn>
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl">
              <img
                src={heroImage}
                alt={project!.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {project!.name}
                </h2>
                {project!.featured && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald rounded-lg">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ─── Title (if no hero image) ─── */}
        {!heroImage && (
          <FadeIn>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {project!.name}
              </h2>
              {project!.featured && (
                <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald rounded-lg">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
          </FadeIn>
        )}

        {/* ─── Category Badge ─── */}
        {project!.category && (
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald/10 text-emerald">
              <Folder className="w-3 h-3" />
              {project!.category}
            </span>
          </FadeIn>
        )}

        {/* ─── Description ─── */}
        <FadeIn delay={0.15}>
          <CardShell className="p-6 md:p-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project!.description}
            </p>
          </CardShell>
        </FadeIn>

        {/* ─── Action Buttons ─── */}
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap gap-3">
            {project!.demoUrl && (
              <a
                href={project!.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors"
              >
                <Globe className="w-4 h-4" /> Live Demo
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project!.githubUrl && (
              <a
                href={project!.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:border-emerald hover:text-emerald transition-colors"
              >
                <Github className="w-4 h-4" /> View Source
              </a>
            )}
          </div>
        </FadeIn>

        {/* ─── Tech Stack / Tags ─── */}
        {projectTags.length > 0 && (
          <FadeIn delay={0.25}>
            <CardShell className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-emerald" />
                <h3 className="text-base font-bold text-foreground">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald bg-emerald/10 rounded-lg"
                  >
                    <Tag className="w-3 h-3" />
                    {t}
                  </span>
                ))}
              </div>
            </CardShell>
          </FadeIn>
        )}

        {/* ─── Project Details Card ─── */}
        <FadeIn delay={0.3}>
          <CardShell className="p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-4">Project Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-foreground">
                  {project!.category || "Uncategorized"}
                </p>
              </div>
              {/* Featured Status */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-semibold text-foreground">
                  {project!.featured ? "Featured Project" : "Project"}
                </p>
              </div>
              {/* Demo Link */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Live Demo</p>
                {project!.demoUrl ? (
                  <a
                    href={project!.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald hover:underline inline-flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
              {/* GitHub Link */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Source Code</p>
                {project!.githubUrl ? (
                  <a
                    href={project!.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald hover:underline inline-flex items-center gap-1"
                  >
                    Repository <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Related Projects ─── */}
        {relatedProjects.length > 0 && (
          <FadeIn delay={0.35}>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Related Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProjects.map((rp, i) => {
                  const rpTags = splitTags(rp.tags);
                  const rpImage = resolveImage(rp);
                  return (
                    <FadeIn key={rp.id} delay={0.4 + i * 0.06}>
                      <Link href={`/projects/${rp.id}`}>
                        <CardShell className="overflow-hidden h-full flex flex-col">
                          {rpImage && (
                            <div className="aspect-[16/9] overflow-hidden relative group">
                              <img
                                src={rpImage}
                                alt={rp.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              {rp.featured && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald rounded-md flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Featured
                                </span>
                              )}
                            </div>
                          )}
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-foreground">
                                {rp.name}
                              </h4>
                              {rp.category && (
                                <span className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md whitespace-nowrap shrink-0">
                                  {rp.category}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                              {rp.description}
                            </p>
                            {rpTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {rpTags.slice(0, 3).map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                              {rp.demoUrl && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald">
                                  <ExternalLink className="w-3 h-3" /> Demo
                                </span>
                              )}
                              {rp.githubUrl && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                  <Github className="w-3 h-3" /> Code
                                </span>
                              )}
                            </div>
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
