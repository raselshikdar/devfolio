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

const SOCIAL_LINKS = [
  { icon: Github, href: "#", label: "GitHub", handle: "@alexmorgan" },
  { icon: Linkedin, href: "#", label: "LinkedIn", handle: "in/alexmorgan" },
  { icon: Twitter, href: "#", label: "Twitter / X", handle: "@alexmorgan_dev" },
  { icon: Instagram, href: "#", label: "Instagram", handle: "@alex.codes" },
  { icon: Youtube, href: "#", label: "YouTube", handle: "Alex Morgan Dev" },
  { icon: Facebook, href: "#", label: "Facebook", handle: "Alex Morgan" },
  { icon: Dribbble, href: "#", label: "Dribbble", handle: "@alexmorgan" },
];

/* ─── Page ─── */

export default function ContactPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-muted-foreground" />
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
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Availability</p>
                      <p className="text-sm font-medium text-foreground">Mon – Fri, 9 AM – 6 PM PST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <p className="text-sm font-medium text-foreground">alexmorgan.dev</p>
                    </div>
                  </div>
                </div>
              </CardShell>
            </FadeIn>

            {/* Social links */}
            <FadeIn>
              <CardShell className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-emerald" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Social</h2>
                </div>
                <div className="space-y-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label, handle }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-emerald transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald/10 transition-colors">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardShell>
            </FadeIn>
          </div>
        </div>
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
