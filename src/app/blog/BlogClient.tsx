"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  FileText,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Search,
  Tag,
  X,
  FolderOpen,
  Star,
} from "lucide-react";

/* ─── Types ─── */

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  featuredImage?: string | null;
  tags?: string | null;
  category?: string | null;
  published?: boolean;
  featured?: boolean;
}

/* ─── Fallback Data ─── */

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "Building Scalable APIs with Next.js Server Actions",
    date: "May 15, 2026",
    excerpt:
      "A deep dive into leveraging server actions for type-safe, performant API design. Learn how to eliminate boilerplate and improve developer experience with this modern approach to full-stack development.",
    content:
      '<p>Server Actions in Next.js represent a paradigm shift in how we think about API design. Instead of manually creating API routes, serializing data, and handling request/response cycles, Server Actions let you write server-side functions that can be called directly from your components.</p><h2>Why Server Actions?</h2><p>Traditional REST APIs require significant boilerplate. You need to define routes, validate inputs, handle errors, and manage loading states. Server Actions simplify this by:</p><ul><li>Eliminating the need for manual API route creation</li><li>Providing type-safe function calls from client to server</li><li>Reducing the amount of client-side JavaScript shipped to the browser</li></ul><h2>Getting Started</h2><p>To create a Server Action, simply define an async function with the <code>"use server"</code> directive. This tells Next.js that the function should execute on the server.</p><h2>Best Practices</h2><p>Always validate inputs on the server side, even when using TypeScript. Use <code>zod</code> schemas for runtime validation and return meaningful error messages to the client.</p>',
    image: "https://picsum.photos/seed/blog1/600/340",
    featuredImage: "",
    tags: "Next.js,API,Server Actions",
    category: "Tutorial",
    featured: true,
  },
  {
    id: "b2",
    title: "The Future of CSS: What's Coming in 2027",
    date: "Apr 28, 2026",
    excerpt:
      "Exploring upcoming CSS features that will transform how we build interfaces. From native nesting to container queries, the future of styling looks brighter than ever.",
    content:
      '<p>CSS continues to evolve at a rapid pace. The CSS Working Group has been working on features that will fundamentally change how we approach styling on the web.</p><h2>Native Nesting</h2><p>Native CSS nesting is finally here and supported across all major browsers. This means you can write nested selectors without preprocessors like Sass:</p><pre><code>.card {\n  background: white;\n  &:hover {\n    box-shadow: 0 4px 12px rgba(0,0,0,.1);\n  }\n}</code></pre><h2>Container Queries</h2><p>Container queries allow components to adapt based on their container size, not just the viewport. This is a game-changer for reusable components.</p><h2>Scroll-Driven Animations</h2><p>With scroll-driven animations, you can create complex scroll-linked effects without any JavaScript.</p>',
    image: "https://picsum.photos/seed/blog2/600/340",
    featuredImage: "",
    tags: "CSS,Frontend,Design",
    category: "Opinion",
    featured: true,
  },
  {
    id: "b3",
    title: "Why I Switched from Redux to Zustand",
    date: "Apr 10, 2026",
    excerpt:
      "My journey simplifying state management with a lighter, more intuitive library. Comparing boilerplate, performance, and developer experience between the two approaches.",
    content:
      '<p>After years of using Redux in production applications, I finally made the switch to Zustand. Here\'s what I learned along the way.</p><h2>The Redux Boilerplate Problem</h2><p>Redux requires actions, reducers, middleware, and selectors. For a simple counter, you need at least three files. This overhead slows development and makes the codebase harder to maintain.</p><h2>Enter Zustand</h2><p>Zustand takes a different approach. A store is just a hook. No providers, no boilerplate, just simple state management:</p><pre><code>const useStore = create((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.count + 1 })),\n}))</code></pre><h2>Performance Comparison</h2><p>Zustand uses unopinionated subscriptions. Components only re-render when the specific slice of state they subscribe to changes. This leads to better performance out of the box.</p>',
    image: "https://picsum.photos/seed/blog3/600/340",
    featuredImage: "",
    tags: "React,State Management,Zustand",
    category: "Experience",
    featured: false,
  },
  {
    id: "b4",
    title: "Mastering TypeScript Generics: A Practical Guide",
    date: "Mar 22, 2026",
    excerpt:
      "Demystifying TypeScript generics with real-world examples. From basic constraints to conditional types, learn patterns that will level up your type-safe code.",
    content:
      '<p>TypeScript generics are one of the most powerful features of the type system, yet they remain one of the most misunderstood. Let\'s break them down.</p><h2>Basic Generics</h2><p>At their core, generics allow you to write functions and classes that work with multiple types while maintaining type safety.</p><h2>Constraints</h2><p>Sometimes you need to limit what types a generic can accept. Use the <code>extends</code> keyword to add constraints.</p><h2>Conditional Types</h2><p>Conditional types let you express non-uniform type mappings, essentially adding if/else logic to your type definitions.</p>',
    image: "https://picsum.photos/seed/blog4/600/340",
    featuredImage: "",
    tags: "TypeScript,Generics,Programming",
    category: "Tutorial",
    featured: false,
  },
  {
    id: "b5",
    title: "Docker for Frontend Developers: Getting Started",
    date: "Mar 05, 2026",
    excerpt:
      "A beginner-friendly guide to containerizing your frontend applications. Set up reproducible dev environments and streamline your deployment workflow with Docker.",
    content:
      '<p>Docker isn\'t just for backend developers. Frontend teams can benefit enormously from containerization, especially when it comes to reproducible builds and consistent environments.</p><h2>Why Docker for Frontend?</h2><ul><li>Eliminate "works on my machine" problems</li><li>Consistent build environments across team members</li><li>Easier CI/CD pipeline setup</li><li>Simple deployment to any hosting platform</li></ul><h2>Your First Dockerfile</h2><p>Creating a Dockerfile for a Next.js app is straightforward. Use a multi-stage build for optimal image size.</p>',
    image: "https://picsum.photos/seed/blog5/600/340",
    featuredImage: "",
    tags: "Docker,DevOps,Frontend",
    category: "Guide",
    featured: false,
  },
  {
    id: "b6",
    title: "Designing Accessible UIs: Beyond Compliance",
    date: "Feb 18, 2026",
    excerpt:
      "Accessibility is more than checking boxes. Learn how to create interfaces that are genuinely usable by everyone, with practical patterns and testing strategies.",
    content:
      '<p>True accessibility goes beyond WCAG compliance checklists. It\'s about creating experiences that are genuinely usable and delightful for everyone.</p><h2>Common Pitfalls</h2><p>Many teams treat accessibility as an afterthought. This leads to retrofitted solutions that are fragile and incomplete. The key is to integrate accessibility from the design phase.</p><h2>Practical Patterns</h2><p>Use semantic HTML first. Ensure all interactive elements are keyboard accessible. Provide clear focus indicators and logical tab order.</p>',
    image: "https://picsum.photos/seed/blog6/600/340",
    featuredImage: "",
    tags: "Accessibility,Design,UX",
    category: "Design",
    featured: false,
  },
  {
    id: "b7",
    title: "React Server Components: A Deep Comparison",
    date: "Jan 30, 2026",
    excerpt:
      "Comparing RSC patterns with traditional SPA approaches. When to use server components, when to stay client-side, and how to make the most of both worlds.",
    content:
      '<p>React Server Components (RSC) represent a fundamental shift in how we build React applications. Let\'s compare them with traditional SPA approaches.</p><h2>When to Use Server Components</h2><p>Use Server Components when you need to fetch data, access backend resources, or keep sensitive logic on the server. They\'re perfect for data-heavy pages.</p><h2>When to Use Client Components</h2><p>Client Components are still essential for interactivity, browser APIs, and state management. The key is knowing when each is appropriate.</p>',
    image: "https://picsum.photos/seed/blog7/600/340",
    featuredImage: "",
    tags: "React,RSC,Performance",
    category: "Deep Dive",
    featured: false,
  },
  {
    id: "b8",
    title: "My 2026 Developer Toolkit: Tools I Can't Live Without",
    date: "Jan 12, 2026",
    excerpt:
      "A curated list of tools, extensions, and workflows that supercharge my daily development. From editor plugins to CLI utilities that save hours every week.",
    content:
      '<p>Every year I share my updated toolkit. Here are the tools that made the biggest impact on my workflow in 2026.</p><h2>Editor & Extensions</h2><p>VS Code with the right extensions can rival any paid IDE. My must-haves include ESLint, Prettier, Tailwind CSS IntelliSense, and Error Lens.</p><h2>CLI Utilities</h2><p>The command line is where I spend most of my time. Tools like <code>tmux</code>, <code>zoxide</code>, and <code>fzf</code> have become indispensable.</p>',
    image: "https://picsum.photos/seed/blog8/600/340",
    featuredImage: "",
    tags: "Productivity,Tools,Developer Experience",
    category: "Listicle",
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

function resolveImage(item: {
  featuredImage?: string | null;
  image?: string | null;
}): string {
  return item.featuredImage || item.image || "";
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

export default function BlogPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [profileName, setProfileName] = useState("Rasel Shikdar");

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
        if (data.blogPosts?.length) setPosts(data.blogPosts);
        if (data.profile?.name) setProfileName(data.profile.name);
      } catch {
        // Keep fallback data on error
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Derived data ─── */
  const allTags = Array.from(
    new Set(posts.flatMap((p) => splitTags(p.tags)))
  );

  // Sort: featured posts first, then by order
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const featuredPost = sortedPosts.find((p) => p.featured);

  const filtered = sortedPosts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || splitTags(p.tags).includes(activeTag);
    return matchSearch && matchTag;
  });

  // In the grid, exclude the featured post from showing again if it's visible in the featured section
  const gridPosts = filtered.filter(
    (p) => !(featuredPost && p.id === featuredPost.id)
  );

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/#blog"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">Blog</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                {posts.length} articles on development &amp; design
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
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
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    !activeTag
                      ? "bg-emerald text-white"
                      : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTag(tag === activeTag ? null : tag)
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      activeTag === tag
                        ? "bg-emerald text-white"
                        : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* Featured Post Section */}
        {featuredPost && (
          <FadeIn>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-emerald fill-emerald" />
                <h2 className="text-sm font-semibold text-foreground">Featured Post</h2>
              </div>
              <Link href={`/blog/${featuredPost.id}`}>
                <CardShell className="overflow-hidden cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {resolveImage(featuredPost) && (
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img
                          src={resolveImage(featuredPost)}
                          alt={featuredPost.title}
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
                        {featuredPost.category && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald/10 text-emerald">
                            <FolderOpen className="w-2.5 h-2.5" />
                            {featuredPost.category}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                        {featuredPost.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" /> {featuredPost.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline mt-4 self-start">
                        Read More <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </CardShell>
              </Link>
            </div>
          </FadeIn>
        )}

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridPosts.map((post, i) => {
            const postTags = splitTags(post.tags);
            const displayImage = resolveImage(post);

            return (
              <FadeIn key={post.id} delay={i * 0.06}>
                <Link href={`/blog/${post.id}`}>
                  <CardShell className="overflow-hidden h-full flex flex-col cursor-pointer">
                    {/* Featured image */}
                    {displayImage && (
                      <div className="aspect-[16/9] overflow-hidden relative group">
                        <img
                          src={displayImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Featured badge on image */}
                        {post.featured && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-emerald rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      {/* Category badge */}
                      {post.category && (
                        <span className="inline-flex items-center gap-1 w-fit px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald/10 text-emerald mb-2.5">
                          <FolderOpen className="w-2.5 h-2.5" />
                          {post.category}
                        </span>
                      )}

                      {/* Featured badge (when no image) */}
                      {!displayImage && post.featured && (
                        <span className="inline-flex items-center gap-1 w-fit px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald/10 text-emerald mb-2.5">
                          <Star className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}

                      <h3 className="text-sm font-semibold text-foreground leading-snug">
                        {post.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Tags as emerald pills */}
                      {postTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {postTags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline mt-3 self-start">
                        Read More <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardShell>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No articles found matching your search.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {profileName}. All rights reserved.
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald text-white shadow-lg flex items-center justify-center hover:bg-emerald-hover transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Prose-like styling for blog HTML content */}
      <style jsx global>{`
        .blog-prose {
          font-size: 0.9375rem;
          line-height: 1.75;
          color: var(--foreground);
        }
        .blog-prose h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          color: var(--foreground);
        }
        .blog-prose h2 {
          font-size: 1.375rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
          color: var(--foreground);
        }
        .blog-prose h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          color: var(--foreground);
        }
        .blog-prose h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .blog-prose p {
          margin-bottom: 1rem;
          color: var(--muted-foreground);
        }
        .blog-prose ul,
        .blog-prose ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .blog-prose ul {
          list-style-type: disc;
        }
        .blog-prose ol {
          list-style-type: decimal;
        }
        .blog-prose li {
          margin-bottom: 0.375rem;
          color: var(--muted-foreground);
        }
        .blog-prose li::marker {
          color: #10b981;
        }
        .blog-prose a {
          color: #10b981;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-prose a:hover {
          color: #059669;
        }
        .blog-prose blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1rem;
          margin: 1.25rem 0;
          font-style: italic;
          color: var(--muted-foreground);
        }
        .blog-prose code {
          font-size: 0.85em;
          padding: 0.15em 0.4em;
          border-radius: 0.25rem;
          background: var(--muted);
          color: #10b981;
          font-family: var(--font-mono), ui-monospace, monospace;
        }
        .blog-prose pre {
          margin-bottom: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          background: var(--muted);
          padding: 1rem 1.25rem;
          border: 1px solid var(--border);
        }
        .blog-prose pre code {
          padding: 0;
          background: transparent;
          font-size: 0.8125rem;
          line-height: 1.65;
          color: var(--foreground);
        }
        .blog-prose hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }
        .blog-prose img {
          border-radius: 0.75rem;
          margin: 1rem 0;
          max-width: 100%;
        }
        .blog-prose table {
          width: 100%;
          margin-bottom: 1.25rem;
          border-collapse: collapse;
        }
        .blog-prose th,
        .blog-prose td {
          border: 1px solid var(--border);
          padding: 0.5rem 0.75rem;
          text-align: left;
          font-size: 0.875rem;
        }
        .blog-prose th {
          font-weight: 600;
          background: var(--muted);
        }
      `}</style>
    </div>
  );
}
