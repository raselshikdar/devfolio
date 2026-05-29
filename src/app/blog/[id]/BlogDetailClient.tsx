"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowLeft,
  Calendar,
  FolderOpen,
  Clock,
  Copy,
  Check,
  MessageCircle,
  Send,
  ChevronRight,
  ExternalLink,
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
}

interface BlogComment {
  id: string;
  blogPostId: string;
  name: string;
  content: string;
  createdAt: string;
}

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

function estimateReadTime(content: string | null | undefined): string {
  if (!content) return "1 min read";
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
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
  },
];

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

/* ─── Share Buttons ─── */

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter/X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        LinkedIn
      </a>
    </div>
  );
}

/* ─── Comment Form ─── */

function CommentForm({
  blogPostId,
  onCommentAdded,
}: {
  blogPostId: string;
  onCommentAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError("Name and comment are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/blog-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogPostId, name: name.trim(), content: content.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to post comment.");
        setSubmitting(false);
        return;
      }
      setName("");
      setContent("");
      onCommentAdded();
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors resize-none"
          required
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-3.5 h-3.5" />
        {submitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}

/* ─── Page ─── */

export default function BlogDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [comments, setComments] = useState<BlogComment[]>([]);
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
        if (data.blogPosts?.length) setPosts(data.blogPosts);
      } catch {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ─── Fetch comments ─── */
  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/blog-comments?blogPostId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // Keep empty
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Derived ─── */
  const post = posts.find((p) => p.id === id);

  useEffect(() => {
    if (!loading && !post) setNotFound(true);
    if (post) setNotFound(false);
  }, [loading, post]);

  const postTags = splitTags(post?.tags);
  const readTime = estimateReadTime(post?.content);
  const heroImage = post ? resolveImage(post) : "";

  /* Related posts: same category first, then latest, exclude current */
  const relatedPosts = post
    ? posts
        .filter((p) => p.id !== post.id)
        .sort((a, b) => {
          const aMatch = a.category === post.category ? 1 : 0;
          const bMatch = b.category === post.category ? 1 : 0;
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
          <p className="text-sm text-muted-foreground">Loading article...</p>
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
              href="/blog"
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
              <Calendar className="w-8 h-8 text-emerald/40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Article Not Found</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald text-white hover:bg-emerald-hover transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
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
              href="/blog"
              className="w-9 h-9 shrink-0 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
              aria-label="Back to blog"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {post?.title}
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
                alt={post!.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {post!.title}
                </h2>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ─── Title (if no hero image) ─── */}
        {!heroImage && (
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {post!.title}
            </h2>
          </FadeIn>
        )}

        {/* ─── Meta Info ─── */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap items-center gap-3">
            {post!.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald/10 text-emerald">
                <FolderOpen className="w-3 h-3" />
                {post!.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> {post!.date}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> {readTime}
            </span>
          </div>
        </FadeIn>

        {/* ─── Tags ─── */}
        {postTags.length > 0 && (
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-1.5">
              {postTags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-[11px] font-medium text-emerald bg-emerald/10 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ─── Share Buttons ─── */}
        <FadeIn delay={0.2}>
          <ShareButtons title={post!.title} />
        </FadeIn>

        {/* ─── Content ─── */}
        <FadeIn delay={0.25}>
          <CardShell className="p-6 md:p-8">
            {post!.content ? (
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: post!.content }}
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post!.excerpt}
              </p>
            )}
          </CardShell>
        </FadeIn>

        {/* ─── Comments Section ─── */}
        <FadeIn delay={0.3}>
          <CardShell className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald" />
                <h3 className="text-lg font-bold text-foreground">
                  Comments ({comments.length})
                </h3>
              </div>

              {/* Comment Form */}
              <div className="border-b border-border pb-6">
                <CommentForm
                  blogPostId={id}
                  onCommentAdded={fetchComments}
                />
              </div>

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                )}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        {comment.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Related Posts ─── */}
        {relatedPosts.length > 0 && (
          <FadeIn delay={0.35}>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp, i) => {
                  const rpTags = splitTags(rp.tags);
                  const rpImage = resolveImage(rp);
                  return (
                    <FadeIn key={rp.id} delay={0.4 + i * 0.06}>
                      <Link href={`/blog/${rp.id}`}>
                        <CardShell className="overflow-hidden h-full flex flex-col">
                          {rpImage && (
                            <div className="aspect-[16/9] overflow-hidden">
                              <img
                                src={rpImage}
                                alt={rp.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="p-4 flex flex-col flex-1">
                            {rp.category && (
                              <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald/10 text-emerald mb-1.5">
                                <FolderOpen className="w-2.5 h-2.5" />
                                {rp.category}
                              </span>
                            )}
                            <h4 className="text-xs font-semibold text-foreground leading-snug">
                              {rp.title}
                            </h4>
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3" /> {rp.date}
                            </span>
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
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline mt-2 self-start">
                              Read More <ChevronRight className="w-3 h-3" />
                            </span>
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
