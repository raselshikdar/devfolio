"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Download,
  Send,
  ChevronRight,
  GraduationCap,
  Briefcase,
  ShoppingCart,
  Calendar,
  Image as ImageIcon,
  FileText,
  Code2,
  User,
  Star,
} from "lucide-react";

/* ──────────────────────── Data ──────────────────────── */

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "#blog" },
  { label: "Store", href: "#store" },
  { label: "Contact", href: "#contact" },
];

const EDUCATION = [
  {
    degree: "M.Sc. Computer Science",
    institute: "Stanford University",
    year: "2019 – 2021",
    detail: "Specialized in Machine Learning & Distributed Systems",
  },
  {
    degree: "B.Sc. Software Engineering",
    institute: "MIT",
    year: "2015 – 2019",
    detail: "Graduated with Honors, GPA 3.9/4.0",
  },
  {
    degree: "High School Diploma",
    institute: "Phillips Academy Andover",
    year: "2011 – 2015",
    detail: "Focus on Mathematics and Computer Science",
  },
];

const EXPERIENCE = [
  {
    role: "Senior Full-Stack Developer",
    company: "TechNova Inc.",
    year: "2023 – Present",
    detail: "Leading a team of 8 engineers building next-gen SaaS platform",
  },
  {
    role: "Full-Stack Developer",
    company: "CloudSync Labs",
    year: "2021 – 2023",
    detail: "Built real-time collaboration tools used by 50K+ users",
  },
  {
    role: "Frontend Developer",
    company: "PixelCraft Studio",
    year: "2019 – 2021",
    detail: "Designed and shipped 15+ client-facing web applications",
  },
];

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "GraphQL",
  "Redis",
  "Figma",
  "Git",
  "CI/CD",
  "Prisma",
];

const PROJECTS = [
  {
    name: "TaskFlow",
    description: "AI-powered project management platform with real-time collaboration",
    tags: ["Next.js", "OpenAI", "Socket.io"],
    demo: "#",
    github: "#",
  },
  {
    name: "FinTrack",
    description: "Personal finance dashboard with smart budgeting and analytics",
    tags: ["React", "D3.js", "Node.js"],
    demo: "#",
    github: "#",
  },
  {
    name: "DevChat",
    description: "Real-time messaging app for developer teams with code snippets",
    tags: ["TypeScript", "WebSocket", "Redis"],
    demo: "#",
    github: "#",
  },
  {
    name: "EcoMarket",
    description: "Sustainable e-commerce platform with carbon footprint tracking",
    tags: ["Next.js", "Stripe", "Prisma"],
    demo: "#",
    github: "#",
  },
  {
    name: "MediScan",
    description: "Health monitoring app with ML-powered symptom analysis",
    tags: ["Python", "TensorFlow", "React"],
    demo: "#",
    github: "#",
  },
  {
    name: "LearnHub",
    description: "Online learning platform with interactive coding challenges",
    tags: ["Next.js", "Monaco", "PostgreSQL"],
    demo: "#",
    github: "#",
  },
];

const GALLERY_IMAGES = [
  { src: "https://picsum.photos/seed/portfolio1/400/300", alt: "Mountain landscape" },
  { src: "https://picsum.photos/seed/portfolio2/400/300", alt: "City skyline" },
  { src: "https://picsum.photos/seed/portfolio3/400/300", alt: "Ocean waves" },
  { src: "https://picsum.photos/seed/portfolio4/400/300", alt: "Forest trail" },
  { src: "https://picsum.photos/seed/portfolio5/400/300", alt: "Desert dunes" },
  { src: "https://picsum.photos/seed/portfolio6/400/300", alt: "Northern lights" },
  { src: "https://picsum.photos/seed/portfolio7/400/300", alt: "Tropical beach" },
  { src: "https://picsum.photos/seed/portfolio8/400/300", alt: "Snowy peaks" },
];

const BLOG_POSTS = [
  {
    title: "Building Scalable APIs with Next.js Server Actions",
    date: "May 15, 2026",
    excerpt: "A deep dive into leveraging server actions for type-safe, performant API design.",
    link: "#",
  },
  {
    title: "The Future of CSS: What's Coming in 2027",
    date: "Apr 28, 2026",
    excerpt: "Exploring upcoming CSS features that will transform how we build interfaces.",
    link: "#",
  },
  {
    title: "Why I Switched from Redux to Zustand",
    date: "Apr 10, 2026",
    excerpt: "My journey simplifying state management with a lighter, more intuitive library.",
    link: "#",
  },
];

const STORE_ITEMS = [
  {
    name: "UI Component Kit",
    price: "$29",
    image: "https://picsum.photos/seed/store1/300/200",
  },
  {
    name: "React Hooks Handbook",
    price: "$19",
    image: "https://picsum.photos/seed/store2/300/200",
  },
  {
    name: "Design System Template",
    price: "$39",
    image: "https://picsum.photos/seed/store3/300/200",
  },
];

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

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-emerald" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
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

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function PortfolioPage() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Track mount state via ref to avoid set-state-in-effect lint
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Use flushSync-free pattern: defer to next microtask
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <a href="#" className="text-lg font-bold text-foreground tracking-tight">
            <span className="text-emerald">A</span>lex
            <span className="text-emerald">.</span>
          </a>

          {/* Desktop links */}
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

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
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

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
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
                    <a
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                    >
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
        {/* ─── Hero ─── */}
        <FadeIn>
          <CardShell className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Left */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Hi, I&apos;m <span className="text-emerald">Alex Morgan</span>
                </h1>
                <p className="mt-2 text-muted-foreground text-sm md:text-base">
                  Full-Stack Developer &amp; Designer — crafting elegant digital experiences with modern web technologies.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Me
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald text-emerald text-sm font-semibold hover:bg-emerald/5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                </div>
              </div>
              {/* Right – avatar */}
              <div className="shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-emerald/30 overflow-hidden shadow-md">
                  <img
                    src="https://picsum.photos/seed/avatar42/300/300"
                    alt="Alex Morgan profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── About ─── */}
        <FadeIn id="about">
          <CardShell className="p-6" id="about">
            <SectionHeading icon={User} title="About Me" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              I&apos;m a passionate full-stack developer with 7+ years of experience building high-performance web applications.
              I specialize in React, Next.js, and Node.js ecosystems, with a keen eye for pixel-perfect UI and scalable architecture.
              I thrive at the intersection of design and engineering — translating complex requirements into intuitive, accessible products.
              When I&apos;m not coding, you&apos;ll find me exploring open-source projects, writing technical blog posts, or sketching UI concepts in Figma.
            </p>
          </CardShell>
        </FadeIn>

        {/* ─── Education ─── */}
        <FadeIn id="education">
          <CardShell className="p-6" id="education">
            <SectionHeading icon={GraduationCap} title="Education" />
            <div className="relative pl-6 border-l-2 border-emerald/30 space-y-5">
              {EDUCATION.map((e, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[1.55rem] top-1 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{e.degree}</h3>
                      <p className="text-xs text-muted-foreground">{e.institute}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald whitespace-nowrap">{e.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>
                </div>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Experience ─── */}
        <FadeIn id="experience">
          <CardShell className="p-6" id="experience">
            <SectionHeading icon={Briefcase} title="Experience" />
            <div className="relative pl-6 border-l-2 border-emerald/30 space-y-5">
              {EXPERIENCE.map((e, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[1.55rem] top-1 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{e.role}</h3>
                      <p className="text-xs text-muted-foreground">{e.company}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald whitespace-nowrap">{e.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.detail}</p>
                </div>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Skills ─── */}
        <FadeIn id="skills">
          <CardShell className="p-6" id="skills">
            <SectionHeading icon={Code2} title="Skills" />
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-lg hover:border-emerald hover:text-emerald transition-colors cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* ─── Projects ─── */}
        <FadeIn id="projects">
          <div id="projects">
            <SectionHeading icon={Star} title="Projects" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS.map((p, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <CardShell className="p-5 h-full flex flex-col">
                    <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-medium text-emerald bg-emerald/10 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <a
                        href={p.demo}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Live Demo
                      </a>
                      <a
                        href={p.github}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald transition-colors"
                      >
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Gallery ─── */}
        <FadeIn id="gallery">
          <CardShell className="p-6" id="gallery">
            <SectionHeading icon={ImageIcon} title="Gallery" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(img.src)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-emerald transition-colors cursor-pointer"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </CardShell>
        </FadeIn>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={lightbox}
                alt="Gallery preview"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Blog ─── */}
        <FadeIn id="blog">
          <div id="blog">
            <SectionHeading icon={FileText} title="Blog" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BLOG_POSTS.map((post, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <CardShell className="p-5 h-full flex flex-col">
                    <h3 className="text-sm font-semibold text-foreground leading-snug">{post.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{post.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex-1">{post.excerpt}</p>
                    <a
                      href={post.link}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald mt-3 hover:underline"
                    >
                      Read More <ChevronRight className="w-3 h-3" />
                    </a>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Store ─── */}
        <FadeIn id="store">
          <div id="store">
            <SectionHeading icon={ShoppingCart} title="Store" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STORE_ITEMS.map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <CardShell className="overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        <span className="text-xs text-emerald font-bold">{item.price}</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </CardShell>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ─── Contact ─── */}
        <FadeIn id="contact">
          <CardShell className="p-6" id="contact">
            <SectionHeading icon={Mail} title="Contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form */}
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message sent! (Demo)");
                }}
              >
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your Message"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>

              {/* Contact info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0 group-hover:border-emerald transition-colors">
                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-emerald" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">alex.morgan@email.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">San Francisco, CA</p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-2 pt-2">
                  {[
                    { icon: Github, href: "#", label: "GitHub" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </CardShell>
        </FadeIn>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alex Morgan. All rights reserved.</p>
          <div className="flex gap-3">
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Twitter, href: "#", label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-emerald transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
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
  );
}
