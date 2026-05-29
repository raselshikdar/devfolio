"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUp,
  Mail,
  Download,
  Send,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  ShoppingCart,
  Calendar,
  Image as ImageIcon,
  FileText,
  Code2,
  User,
  Star,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Dribbble,
  ExternalLink,
  Quote,
  StickyNote,
  BarChart3,
} from "lucide-react";

// Dynamically import podcast ring to avoid SSR issues
const LivePodcastRing = dynamic(
  () => import("@/components/LivePodcastRing"),
  { ssr: false }
);

/* ──────────────────────── Fallback Data ──────────────────────── */

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Store", href: "#store" },
  { label: "Contact", href: "#contact" },
];

const FALLBACK_EDUCATION = [
  { id: "e1", degree: "SSC — Science", institute: "Chapri Public School & College", year: "2013 – 2015", detail: "" },
  { id: "e2", degree: "HSC — Humanities", institute: "Chapri Public School & College", year: "2015 – 2017", detail: "" },
  { id: "e3", degree: "BSS — Political Science", institute: "National University", year: "2017 – 2021", detail: "" },
  { id: "e4", degree: "MSS — Political Science", institute: "National University", year: "2021 – 2022", detail: "" },
];

const FALLBACK_EXPERIENCE = [
  { id: "x1", role: "Freelancer & Tech Blogger", company: "Self-Employed", year: "2019 – Present", detail: "Building web solutions and sharing technical knowledge through blog content" },
  { id: "x2", role: "Open Source Contributor", company: "GitHub", year: "2019 – Present", detail: "Contributing to open-source projects and the developer community" },
  { id: "x3", role: "Freelance Web Developer", company: "Self-Employed", year: "2021 – Present", detail: "Delivering modern, scalable web applications for clients worldwide" },
];

const FALLBACK_SKILLS = [
  { id: "s1", name: "React" }, { id: "s2", name: "Next.js" }, { id: "s3", name: "TypeScript" },
  { id: "s4", name: "Node.js" }, { id: "s5", name: "Python" }, { id: "s6", name: "PostgreSQL" },
  { id: "s7", name: "MongoDB" }, { id: "s8", name: "Tailwind CSS" }, { id: "s9", name: "Docker" },
  { id: "s10", name: "AWS" }, { id: "s11", name: "GraphQL" }, { id: "s12", name: "Redis" },
  { id: "s13", name: "Figma" }, { id: "s14", name: "Git" }, { id: "s15", name: "CI/CD" },
  { id: "s16", name: "Prisma" },
];

const FALLBACK_GALLERY_IMAGES = [
  { id: "g1", src: "https://picsum.photos/seed/portfolio1/400/300", alt: "Mountain landscape", category: "landscape" },
  { id: "g2", src: "https://picsum.photos/seed/portfolio2/400/300", alt: "City skyline", category: "urban" },
  { id: "g3", src: "https://picsum.photos/seed/portfolio3/400/300", alt: "Ocean waves", category: "nature" },
  { id: "g4", src: "https://picsum.photos/seed/portfolio4/400/300", alt: "Forest trail", category: "nature" },
];

const FALLBACK_NOTES = [
  { id: "n1", title: "On Building for Scale", content: "The best architectures emerge not from upfront design, but from iterative refinement. Start simple, measure often, and refactor ruthlessly.", date: "May 20, 2026" },
  { id: "n2", title: "Design is How It Works", content: "Beautiful interfaces that don't solve real problems are just decoration. Always start with the user's pain point and work backwards to the solution.", date: "Apr 15, 2026" },
  { id: "n3", title: "The Power of Boring Tech", content: "Choose proven technologies for your stack. Innovation belongs in your product, not your infrastructure. Boring tech lets you move fast with confidence.", date: "Mar 08, 2026" },
];

const FALLBACK_QUOTES = [
  { id: "q1", text: "Code is like humor. When you have to explain it, it's bad.", context: "On writing clean code" },
  { id: "q2", text: "First, solve the problem. Then, write the code.", context: "On thinking before coding" },
  { id: "q3", text: "Simplicity is the soul of efficiency.", context: "On keeping things simple" },
];

const FALLBACK_PROJECTS = [
  { id: "p1", name: "TaskFlow", description: "AI-powered project management platform with real-time collaboration", tags: "Next.js,OpenAI,Socket.io", demoUrl: "#", githubUrl: "#", image: "https://picsum.photos/seed/proj1/600/340", featuredImage: "", featured: true, category: "" },
  { id: "p2", name: "FinTrack", description: "Personal finance dashboard with smart budgeting and analytics", tags: "React,D3.js,Node.js", demoUrl: "#", githubUrl: "#", image: "https://picsum.photos/seed/proj2/600/340", featuredImage: "", featured: true, category: "" },
  { id: "p3", name: "DevChat", description: "Real-time messaging app for developer teams with code snippets", tags: "TypeScript,WebSocket,Redis", demoUrl: "#", githubUrl: "#", image: "https://picsum.photos/seed/proj3/600/340", featuredImage: "", featured: true, category: "" },
  { id: "p4", name: "EcoMarket", description: "Sustainable e-commerce platform with carbon footprint tracking", tags: "Next.js,Stripe,Prisma", demoUrl: "#", githubUrl: "#", image: "https://picsum.photos/seed/proj4/600/340", featuredImage: "", featured: true, category: "" },
];

const FALLBACK_BLOG_POSTS = [
  { id: "b1", title: "Building Scalable APIs with Next.js Server Actions", date: "May 15, 2026", excerpt: "A deep dive into leveraging server actions for type-safe, performant API design.", image: "https://picsum.photos/seed/blog1/600/340", featuredImage: "", tags: "", category: "" },
  { id: "b2", title: "The Future of CSS: What's Coming in 2027", date: "Apr 28, 2026", excerpt: "Exploring upcoming CSS features that will transform how we build interfaces.", image: "https://picsum.photos/seed/blog2/600/340", featuredImage: "", tags: "", category: "" },
  { id: "b3", title: "Why I Switched from Redux to Zustand", date: "Apr 10, 2026", excerpt: "My journey simplifying state management with a lighter, more intuitive library.", image: "https://picsum.photos/seed/blog3/600/340", featuredImage: "", tags: "", category: "" },
];

const FALLBACK_STORE_ITEMS = [
  { id: "st1", name: "UI Component Kit", price: "$29", image: "https://picsum.photos/seed/store1/300/200", featuredImage: "", description: "", category: "", rating: 4.8 },
  { id: "st2", name: "React Hooks Handbook", price: "$19", image: "https://picsum.photos/seed/store2/300/200", featuredImage: "", description: "", category: "", rating: 4.5 },
  { id: "st3", name: "Design System Template", price: "$39", image: "https://picsum.photos/seed/store3/300/200", featuredImage: "", description: "", category: "", rating: 4.9 },
];

const FALLBACK_PROFILE = {
  id: "pr1",
  name: "Rasel Shikdar",
  tagline: "Full-Stack Developer — building modern, scalable, and high-performance web applications with clean UI/UX and smooth user experiences.",
  avatar: "https://picsum.photos/seed/avatar42/300/300",
  about: "Passionate full-stack developer focused on building modern, scalable, and high-performance web applications with clean UI/UX and smooth user experiences. With 5+ years of experience and 50+ projects completed, I thrive at the intersection of design and engineering — turning complex ideas into elegant digital solutions. My academic background in Political Science (BSS & MSS) gives me a unique analytical perspective that complements my technical expertise.",
  email: "info@raselsh.pro.bd",
  phone: "",
  location: "",
  website: "",
  resume: "",
};

const FALLBACK_SOCIAL_LINKS = [
  { id: "sl1", platform: "GitHub", url: "https://github.com/raselshikdar", icon: "github", handle: "" },
  { id: "sl2", platform: "Facebook", url: "https://facebook.com/raselverse", icon: "facebook", handle: "" },
  { id: "sl3", platform: "LinkedIn", url: "https://linkedin.com/in/raselshikdar", icon: "linkedin", handle: "" },
  { id: "sl4", platform: "X", url: "https://x.com/raselshikdar_", icon: "twitter", handle: "" },
  { id: "sl5", platform: "Email", url: "mailto:info@raselsh.pro.bd", icon: "mail", handle: "" },
  { id: "sl6", platform: "Telegram", url: "https://t.me/rasel597", icon: "send", handle: "" },
];

/* ─── Gallery Tabs ─── */
type GalleryTab = "images" | "notes" | "quotes";

const GALLERY_TABS: { key: GalleryTab; label: string; icon: React.ElementType }[] = [
  { key: "images", label: "Images", icon: ImageIcon },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "quotes", label: "Quotes", icon: Quote },
];

/* ─── Social icon mapper ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  dribbble: Dribbble,
  x: Twitter,
  mail: Mail,
  send: Send,
};

/* ─── Helper: split comma-separated tags ─── */
function splitTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

/* ─── Helper: resolve image with featuredImage fallback ─── */
function resolveImage(item: { featuredImage?: string | null; image?: string | null }): string {
  return item.featuredImage || item.image || "";
}

/* ──────────────────── Fade-in Wrapper ──────────────────── */

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

/* ──────────────────── Section Heading ──────────────────── */

function SectionHeading({
  icon: Icon,
  title,
  viewAllHref,
}: {
  icon: React.ElementType;
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

/* ──────────────────── Card Shell ──────────────────── */

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-sm transition-colors duration-200 hover:border-emerald ${className}`}
    >
      {children}
    </div>
  );
}

/* ──────────────────── Count-Up Hook ──────────────────── */

function useCountUp(end: number, duration = 1400, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) { setCount(0); return; }
    let frame: number;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, started]);
  return count;
}

/* ──────────────────── Stat Ring Component ──────────────────── */

const STAT_ITEMS = [
  { key: "projects",  label: "Total Projects",      color: "#06B6D4", glow: "0 0 8px 2px rgba(6,182,212,.45)" },
  { key: "experience",label: "Years of Experience",  color: "#A855F7", glow: "0 0 8px 2px rgba(168,85,247,.45)" },
  { key: "blogs",     label: "Blogs",                color: "#EC4899", glow: "0 0 8px 2px rgba(236,72,153,.45)" },
  { key: "products",  label: "Store Products",       color: "#06B6D4", glow: "0 0 8px 2px rgba(6,182,212,.45)" },
  { key: "visitors",  label: "Visitors",             color: "#A855F7", glow: "0 0 8px 2px rgba(168,85,247,.45)" },
] as const;

type StatKey = (typeof STAT_ITEMS)[number]["key"];

function SingleStatRing({
  label,
  color,
  glow,
  displayValue,
  progress,
  animate,
}: {
  label: string;
  color: string;
  glow: string;
  displayValue: string;
  progress: number;
  animate: boolean;
}) {
  const size = 56;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: glow }}
        >
          {/* background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          {/* progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animate ? offset : circumference}
            style={{
              transition: animate ? "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" : "none",
            }}
          />
        </svg>
        {/* value centred inside the ring */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
          {displayValue}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function StatRings({
  projects,
  blogPosts,
  storeProducts,
}: {
  projects: number;
  blogPosts: number;
  storeProducts: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setAnimate(true), 80);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  /* count-up hooks — only start when visible */
  const cProjects  = useCountUp(projects,  1400, animate);
  const cBlogs     = useCountUp(blogPosts,  1400, animate);
  const cProducts  = useCountUp(storeProducts, 1400, animate);
  const cVisitors  = useCountUp(2500, 1800, animate);

  const values: Record<StatKey, { display: string; progress: number }> = {
    projects:   { display: String(cProjects),   progress: Math.min(projects / 20, 1) },
    experience: { display: animate ? "5+" : "0", progress: 5 / 10 },
    blogs:      { display: String(cBlogs),       progress: Math.min(blogPosts / 15, 1) },
    products:   { display: String(cProducts),    progress: Math.min(storeProducts / 15, 1) },
    visitors:   { display: cVisitors >= 1000 ? `${(cVisitors / 1000).toFixed(1)}K` : String(cVisitors), progress: Math.min(2500 / 5000, 1) },
  };

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-5 md:gap-8">
      {STAT_ITEMS.map((s) => (
        <SingleStatRing
          key={s.key}
          label={s.label}
          color={s.color}
          glow={s.glow}
          displayValue={values[s.key].display}
          progress={values[s.key].progress}
          animate={animate}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function PortfolioPage() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [galleryTab, setGalleryTab] = useState<GalleryTab>("images");

  /* ─── API data state ─── */
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [education, setEducation] = useState(FALLBACK_EDUCATION);
  const [experience, setExperience] = useState(FALLBACK_EXPERIENCE);
  const [skills, setSkills] = useState(FALLBACK_SKILLS);
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY_IMAGES);
  const [notes, setNotes] = useState(FALLBACK_NOTES);
  const [quotes, setQuotes] = useState(FALLBACK_QUOTES);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [blogPosts, setBlogPosts] = useState(FALLBACK_BLOG_POSTS);
  const [storeProducts, setStoreProducts] = useState(FALLBACK_STORE_ITEMS);
  const [socialLinks, setSocialLinks] = useState(FALLBACK_SOCIAL_LINKS);
  const [welcomePopup, setWelcomePopup] = useState<any>(null);
  const [popupDismissed, setPopupDismissed] = useState(false);

  /* ─── Derived: top 4 gallery images for homepage ─── */
  const homepageGalleryImages = galleryImages.slice(0, 4);

  /* ─── Derived: top 4 projects for homepage ─── */
  const homepageProjects = projects.slice(0, 4);

  const mountedRef = useRef(false);

  /* ─── Fetch API data on mount ─── */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) return;
        const data = await res.json();

        if (data.profile) setProfile(data.profile);
        if (data.education?.length) setEducation(data.education);
        if (data.experience?.length) setExperience(data.experience);
        if (data.skills?.length) setSkills(data.skills);
        if (data.galleryImages?.length) setGalleryImages(data.galleryImages);
        if (data.notes?.length) setNotes(data.notes);
        if (data.quotes?.length) setQuotes(data.quotes);
        if (data.projects?.length) setProjects(data.projects);
        if (data.blogPosts?.length) setBlogPosts(data.blogPosts);
        if (data.storeProducts?.length) setStoreProducts(data.storeProducts);
        if (data.socialLinks?.length) setSocialLinks(data.socialLinks);
        if (data.welcomePopup) setWelcomePopup(data.welcomePopup);
      } catch {
        // Keep fallback data on error
      }
    }
    fetchData();
  }, []);

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ─── Lightbox keyboard navigation ─── */
  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowRight") {
        setLightbox((prev) =>
          prev !== null ? (prev + 1) % homepageGalleryImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setLightbox((prev) =>
          prev !== null
            ? (prev - 1 + homepageGalleryImages.length) % homepageGalleryImages.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, homepageGalleryImages.length]);

  /* ─── Lightbox touch swipe ─── */
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;
      const diff = e.changedTouches[0].clientX - touchStartRef.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff < 0) {
          // Swipe left → next
          setLightbox((prev) =>
            prev !== null ? (prev + 1) % homepageGalleryImages.length : null
          );
        } else {
          // Swipe right → previous
          setLightbox((prev) =>
            prev !== null
              ? (prev - 1 + homepageGalleryImages.length) % homepageGalleryImages.length
              : null
          );
        }
      }
      touchStartRef.current = null;
    },
    [homepageGalleryImages.length]
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  /* ─── Check localStorage for dismissed popup ─── */
  useEffect(() => {
    if (welcomePopup?.showOnce && welcomePopup?.id) {
      const dismissed = localStorage.getItem(`popup_dismissed_${welcomePopup.id}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (dismissed) setPopupDismissed(true);
    }
  }, [welcomePopup]);

  /* ─── Derived: social links split into two rows ─── */
  const socialRow1 = socialLinks.slice(0, 4);
  const socialRow2 = socialLinks.slice(4, 7);

  return (
    <>
    {/* ─── Welcome Popup ─── */}
    <AnimatePresence>
      {welcomePopup && welcomePopup.enabled && !popupDismissed && mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setPopupDismissed(true);
            if (welcomePopup.showOnce && welcomePopup.id) {
              localStorage.setItem(`popup_dismissed_${welcomePopup.id}`, "true");
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setPopupDismissed(true);
                if (welcomePopup.showOnce && welcomePopup.id) {
                  localStorage.setItem(`popup_dismissed_${welcomePopup.id}`, "true");
                }
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald transition-colors"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            {welcomePopup.imageUrl && (
              <div className="w-full aspect-[2/1] overflow-hidden">
                <img src={welcomePopup.imageUrl} alt={welcomePopup.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-foreground">{welcomePopup.title}</h2>
              {welcomePopup.message && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{welcomePopup.message}</p>
              )}
              {welcomePopup.buttonText && welcomePopup.buttonUrl && (
                <a
                  href={welcomePopup.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors shadow-sm"
                >
                  {welcomePopup.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <a href="#" className="text-lg font-bold text-foreground tracking-tight">
            <span className="text-emerald">{profile.name?.charAt(0) || "A"}</span>{profile.name?.slice(1).split(" ")[0] || "lex"}<span className="text-emerald">.</span>
          </a>
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors rounded-md hover:bg-emerald/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
            >
              <ul className="flex flex-col px-4 py-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── Hero + About: Side by side on desktop ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ─── Hero ─── */}
          <FadeIn className="h-full">
            <CardShell className="p-6 md:p-8 h-full">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                    Hi, I&apos;m <span className="text-emerald">{profile.name}</span>
                  </h1>
                  <p className="mt-2 text-muted-foreground text-sm md:text-base">
                    {profile.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                    <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors shadow-sm">
                      <Mail className="w-4 h-4" /> Contact Me
                    </a>
                    {profile.resume && (
                      <a href={profile.resume} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald text-emerald text-sm font-semibold hover:bg-emerald/5 transition-colors">
                        <Download className="w-4 h-4" /> Download CV
                      </a>
                    )}
                    {!profile.resume && (
                      <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald text-emerald text-sm font-semibold hover:bg-emerald/5 transition-colors">
                        <Download className="w-4 h-4" /> Download CV
                      </a>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <LivePodcastRing>
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-emerald/30 overflow-hidden shadow-md">
                      <img src={profile.avatar || "https://picsum.photos/seed/avatar42/300/300"} alt={`${profile.name} profile photo`} className="w-full h-full object-cover" />
                    </div>
                  </LivePodcastRing>
                </div>
              </div>
            </CardShell>
          </FadeIn>

          {/* ─── About ─── */}
          <FadeIn className="h-full">
            <CardShell className="p-6 h-full" id="about">
              <SectionHeading icon={User} title="About Me" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {profile.about}
              </p>
            </CardShell>
          </FadeIn>
        </div>

        {/* ─── Education + Experience: Side by side on desktop ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ─── Education ─── */}
          <FadeIn className="h-full">
            <CardShell className="p-6 h-full" id="education">
              <SectionHeading icon={GraduationCap} title="Education" />
              <div className="relative pl-6 border-l-2 border-emerald/30 space-y-5">
                {education.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[1.55rem] top-1 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{e.degree}</h3>
                        <p className="text-xs text-muted-foreground">{e.institute}</p>
                      </div>
                      <span className="text-xs font-medium text-emerald whitespace-nowrap">{e.year}</span>
                    </div>
                    {e.detail && <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>}
                  </div>
                ))}
              </div>
            </CardShell>
          </FadeIn>

          {/* ─── Experience ─── */}
          <FadeIn className="h-full">
            <CardShell className="p-6 h-full" id="experience">
              <SectionHeading icon={Briefcase} title="Experience" />
              <div className="relative pl-6 border-l-2 border-emerald/30 space-y-5">
                {experience.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[1.55rem] top-1 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{e.role}</h3>
                        <p className="text-xs text-muted-foreground">{e.company}</p>
                      </div>
                      <span className="text-xs font-medium text-emerald whitespace-nowrap">{e.year}</span>
                    </div>
                    {e.detail && <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>}
                  </div>
                ))}
              </div>
            </CardShell>
          </FadeIn>
        </div>

        {/* ─── Gallery (before Skills) ─── */}
        <FadeIn>
          <CardShell className="p-6" id="gallery">
            <SectionHeading icon={ImageIcon} title="Gallery" viewAllHref="/gallery" />

            {/* Tab buttons */}
            <div className="flex gap-1 mb-4">
              {GALLERY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setGalleryTab(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    galleryTab === tab.key
                      ? "bg-emerald text-white"
                      : "border border-border text-muted-foreground hover:border-emerald hover:text-emerald"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {galleryTab === "images" && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {homepageGalleryImages.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setLightbox(i)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-emerald transition-colors cursor-pointer"
                      >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {galleryTab === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl border border-border hover:border-emerald transition-colors bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                          <StickyNote className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{note.content}</p>
                          {note.date && <span className="text-[10px] text-muted-foreground mt-2 block">{note.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {galleryTab === "quotes" && (
                <motion.div
                  key="quotes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {quotes.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl border border-border hover:border-emerald transition-colors bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Quote className="w-4 h-4 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground italic leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                          {q.context && <span className="text-[10px] text-emerald font-medium mt-2 block">&mdash; {q.context}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardShell>
        </FadeIn>

        {/* ─── Lightbox with swipe navigation ─── */}
        <AnimatePresence>
          {lightbox !== null && homepageGalleryImages[lightbox] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                key={lightbox}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={homepageGalleryImages[lightbox].src}
                alt={homepageGalleryImages[lightbox].alt}
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left arrow */}
              {homepageGalleryImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((prev) =>
                      prev !== null
                        ? (prev - 1 + homepageGalleryImages.length) % homepageGalleryImages.length
                        : null
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right arrow */}
              {homepageGalleryImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((prev) =>
                      prev !== null ? (prev + 1) % homepageGalleryImages.length : null
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Image index indicator */}
              {homepageGalleryImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium">
                  {lightbox + 1} / {homepageGalleryImages.length}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Skills ─── */}
        <FadeIn>
          <CardShell className="p-6" id="skills">
            <SectionHeading icon={Code2} title="Skills" />
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-lg hover:border-emerald hover:text-emerald transition-colors cursor-default"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Projects (4 with featured images) ─── */}
        <FadeIn>
          <div id="projects">
            <SectionHeading icon={Star} title="Projects" viewAllHref="/projects" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {homepageProjects.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08} className={i >= 3 ? "md:hidden" : ""}>
                  <CardShell className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={resolveImage(p)} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {splitTags(p.tags).map((t) => (
                          <span key={t} className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-3">
                        {p.demoUrl && (
                          <a href={p.demoUrl} className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline">
                            <ExternalLink className="w-3 h-3" /> Live Demo
                          </a>
                        )}
                        {p.githubUrl && (
                          <a href={p.githubUrl} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald transition-colors">
                            <Github className="w-3 h-3" /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Blog (with featured images) ─── */}
        <FadeIn>
          <div id="blog">
            <SectionHeading icon={FileText} title="Blog" viewAllHref="/blog" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogPosts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.08}>
                  <CardShell className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={resolveImage(post)} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{post.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex-1">{post.excerpt}</p>
                      <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-emerald mt-3 hover:underline">
                        Read More <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Store ─── */}
        <FadeIn>
          <div id="store">
            <SectionHeading icon={ShoppingCart} title="Store" viewAllHref="/store" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {storeProducts.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.08}>
                  <CardShell className="overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden">
                      <img src={resolveImage(item)} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        <span className="text-xs text-emerald font-bold">{item.price}</span>
                      </div>
                      {item.buyUrl ? (
                        <a
                          href={item.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors inline-flex items-center gap-1"
                        >
                          Buy Now <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
                          Buy Now
                        </button>
                      )}
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Quick Stats ─── */}
        <FadeIn>
          <CardShell className="p-6" id="stats">
            <SectionHeading icon={BarChart3} title="Quick Stats" />
            <StatRings
              projects={projects.length}
              blogPosts={blogPosts.length}
              storeProducts={storeProducts.length}
            />
          </CardShell>
        </FadeIn>

        {/* ─── Social Media Card ─── */}
        <FadeIn>
          <CardShell className="p-6" id="socials">
            <SectionHeading icon={User} title="Connect With Me" />
            <div className="space-y-3">
              <div className="flex justify-center gap-3">
                {socialRow1.map(({ id, platform, url, icon }) => {
                  const Icon = ICON_MAP[icon?.toLowerCase()] || ExternalLink;
                  return (
                    <a key={id} href={url} aria-label={platform} className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald hover:bg-emerald/5 transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
              {socialRow2.length > 0 && (
                <div className="flex justify-center gap-3">
                  {socialRow2.map(({ id, platform, url, icon }) => {
                    const Icon = ICON_MAP[icon?.toLowerCase()] || ExternalLink;
                    return (
                      <a key={id} href={url} aria-label={platform} className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald hover:bg-emerald/5 transition-colors">
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Contact CTA Card ─── */}
        <FadeIn>
          <Link href="/contact" id="contact">
            <CardShell className="p-6 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-emerald/20 transition-colors">
                  <Send className="w-5 h-5 text-emerald" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">Contact Me</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Have a project in mind? Let&apos;s collaborate and create something extraordinary together.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </CardShell>
          </Link>
        </FadeIn>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 3).map(({ id, platform, url, icon }) => {
              const Icon = ICON_MAP[icon?.toLowerCase()] || ExternalLink;
              return (
                <a key={id} href={url} aria-label={platform} className="hover:text-emerald transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>

      {/* ─── Back to Top ─── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald text-white shadow-lg flex items-center justify-center hover:bg-emerald-hover transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
