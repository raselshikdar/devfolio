"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowLeft,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Dribbble,
  Clock,
  Globe,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

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

const ICON_MAP: Record<string, React.ElementType> = {
  github: Github, linkedin: Linkedin, twitter: Twitter, x: Twitter,
  instagram: Instagram, youtube: Youtube, facebook: Facebook,
  dribbble: Dribbble, mail: Mail, send: Globe, globe: Globe,
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];

/* ─── Page ─── */

export default function ContactPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [profile, setProfile] = useState({
    name: "Rasel Shikdar",
    email: "info@raselsh.pro.bd",
    phone: "",
    location: "",
    website: "",
    avatar: "",
  });
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

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
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile((p) => ({ ...p, ...data.profile }));
        if (data.socialLinks?.length) setSocialLinks(data.socialLinks);
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch { /* ignore */ }
  };

  const contactDetails = [
    { icon: Mail, label: "Email", value: profile.email || "info@raselsh.pro.bd" },
    { icon: Phone, label: "Phone", value: profile.phone, show: !!profile.phone },
    { icon: MapPin, label: "Location", value: profile.location, show: !!profile.location },
    { icon: Clock, label: "Availability", value: "Mon – Fri, 9 AM – 6 PM" },
    { icon: Globe, label: "Website", value: profile.website, show: !!profile.website },
  ].filter((d) => d.show !== false);

  return (
    <div className="dot-pattern min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
            <span className="text-emerald">{profile.name?.charAt(0) || "R"}</span>{profile.name?.slice(1).split(" ")[0] || "asel"}<span className="text-emerald">.</span>
          </Link>
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                    l.href === "/contact"
                      ? "text-emerald bg-emerald/5"
                      : "text-muted-foreground hover:text-emerald hover:bg-emerald/5"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
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
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <ul className="flex flex-col px-4 py-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMobileOpen(false)} className={`block py-2.5 text-sm font-medium transition-colors ${
                    l.href === "/contact" ? "text-emerald" : "text-muted-foreground hover:text-emerald"
                  }`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Back + heading */}
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/#contact" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-emerald hover:text-emerald transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contact Me</h1>
              <p className="text-xs text-muted-foreground">Have a project in mind? Let&apos;s collaborate and create something extraordinary together.</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column — form (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <FadeIn>
              <CardShell className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-emerald" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Send a Message</h2>
                </div>

                {submitted && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald/10 border border-emerald/20 text-sm text-emerald font-medium">
                    Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}

                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="text-xs font-medium text-foreground mb-1 block">Name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-xs font-medium text-foreground mb-1 block">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-xs font-medium text-foreground mb-1 block">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-xs font-medium text-foreground mb-1 block">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell me about your project..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              </CardShell>
            </FadeIn>
          </div>

          {/* Right column — info (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact details */}
            <FadeIn>
              <CardShell className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-emerald" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Get in Touch</h2>
                </div>
                <div className="space-y-4">
                  {contactDetails.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardShell>
            </FadeIn>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <FadeIn>
                <CardShell className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-emerald" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Social</h2>
                  </div>
                  <div className="space-y-2">
                    {socialLinks.map(({ id, platform, url, icon, handle }) => {
                      const Icon = ICON_MAP[icon?.toLowerCase()] || ExternalLink;
                      return (
                        <a
                          key={id}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-emerald transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald/10 transition-colors">
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{platform}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{handle || url}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardShell>
              </FadeIn>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-6">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
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
