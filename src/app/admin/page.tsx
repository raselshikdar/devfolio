"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Sun, Moon, LogOut, Plus, Trash2, Edit3, Save, X, Home,
  User, GraduationCap, Briefcase, Code2, Star, Image as ImageIcon,
  StickyNote, Quote, FileText, ShoppingCart, Mail, Share2,
  ChevronDown, ChevronRight, Check, Eye, EyeOff,
} from "lucide-react";

/* ─── Types ─── */
interface AdminData {
  profile: any; education: any[]; experience: any[]; skills: any[];
  projects: any[]; galleryImages: any[]; notes: any[]; quotes: any[];
  blogPosts: any[]; storeProducts: any[]; messages: any[]; socialLinks: any[];
}

type Section = "profile" | "education" | "experience" | "skills" | "projects" | "gallery" | "notes" | "quotes" | "blog" | "store" | "messages" | "social";

const SECTIONS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Code2 },
  { key: "projects", label: "Projects", icon: Star },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "quotes", label: "Quotes", icon: Quote },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "store", label: "Store", icon: ShoppingCart },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "social", label: "Social Links", icon: Share2 },
];

/* ─── Login Page ─── */
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; queueMicrotask(() => setMounted(true)); }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="dot-pattern min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-foreground tracking-tight">
            <span className="text-emerald">A</span>lex<span className="text-emerald">.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h1 className="text-lg font-semibold text-foreground text-center mb-4">Sign In</h1>
          {error && <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-500 text-xs text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@alex.dev"
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••"
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="flex justify-center mt-4">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-xs text-muted-foreground hover:text-emerald transition-colors flex items-center gap-1">
              {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              Toggle theme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Generic CRUD List ─── */
function CrudList({
  title,
  items,
  fields,
  apiPath,
  onRefresh,
}: {
  title: string;
  items: any[];
  fields: { key: string; label: string; type?: string; placeholder?: string }[];
  apiPath: string;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const startEdit = (item: any) => {
    setEditing(item.id);
    setForm({ ...item });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({});
  };

  const cancelEdit = () => { setEditing(null); setAdding(false); setForm({}); };

  const handleSave = async () => {
    try {
      if (adding) {
        await fetch(apiPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch(apiPath, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      cancelEdit();
      onRefresh();
    } catch { alert("Save failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`${apiPath}?id=${id}`, { method: "DELETE" });
      onRefresh();
    } catch { alert("Delete failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title} ({items.length})</h3>
        <button onClick={startAdd} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Add / Edit form */}
      {(adding || editing) && (
        <div className="mb-4 p-4 rounded-xl border border-emerald/30 bg-emerald/5 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">{adding ? "Add New" : "Edit"}</span>
            <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea rows={3} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors resize-none" />
              ) : (
                <input type={f.type || "text"} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} placeholder={f.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors" />
              )}
            </div>
          ))}
          <button onClick={handleSave} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-xl border border-border hover:border-emerald/40 transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {fields.slice(0, 2).map((f) => (
                  <p key={f.key} className="text-xs text-foreground truncate">
                    {f.key === "image" || f.key === "src" || f.key === "avatar" ? (
                      <span className="text-muted-foreground">{f.label}: </span>
                    ) : null}
                    {String(item[f.key] || "—")}
                  </p>
                ))}
                {item.published !== undefined && (
                  <span className={`text-[10px] font-medium ${item.published ? "text-emerald" : "text-muted-foreground"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                )}
                {item.read !== undefined && (
                  <span className={`text-[10px] font-medium ${item.read ? "text-muted-foreground" : "text-emerald"}`}>
                    {item.read ? "Read" : "New"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors">
                  <Edit3 className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No items yet</p>}
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard({ data, onRefresh, onLogout }: { data: AdminData; onRefresh: () => void; onLogout: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileForm, setProfileForm] = useState(data.profile || {});

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; queueMicrotask(() => setMounted(true)); }
  }, []);

  const handleProfileSave = async () => {
    try {
      await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileForm) });
      onRefresh();
      alert("Profile saved!");
    } catch { alert("Save failed"); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    onLogout();
  };

  const unreadMessages = data.messages?.filter((m: any) => !m.read).length || 0;

  const sectionContent: Record<Section, React.ReactNode> = {
    profile: (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Profile</h3>
        {[
          { key: "name", label: "Name" }, { key: "tagline", label: "Tagline" }, { key: "avatar", label: "Avatar URL" },
          { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "location", label: "Location" },
          { key: "website", label: "Website" }, { key: "resume", label: "Resume URL" },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">{f.label}</label>
            <input type="text" value={profileForm[f.key] || ""} onChange={(e) => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground focus:border-emerald outline-none transition-colors" />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">About</label>
          <textarea rows={4} value={profileForm.about || ""} onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground focus:border-emerald outline-none transition-colors resize-none" />
        </div>
        <button onClick={handleProfileSave} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors">
          <Save className="w-3 h-3" /> Save Profile
        </button>
      </div>
    ),
    education: <CrudList title="Education" items={data.education} fields={[{ key: "degree", label: "Degree" }, { key: "institute", label: "Institute" }, { key: "year", label: "Year" }, { key: "detail", label: "Detail" }]} apiPath="/api/admin/education" onRefresh={onRefresh} />,
    experience: <CrudList title="Experience" items={data.experience} fields={[{ key: "role", label: "Role" }, { key: "company", label: "Company" }, { key: "year", label: "Year" }, { key: "detail", label: "Detail" }]} apiPath="/api/admin/experience" onRefresh={onRefresh} />,
    skills: <CrudList title="Skills" items={data.skills} fields={[{ key: "name", label: "Skill Name" }]} apiPath="/api/admin/skills" onRefresh={onRefresh} />,
    projects: <CrudList title="Projects" items={data.projects} fields={[{ key: "name", label: "Name" }, { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Image URL" }, { key: "tags", label: "Tags (comma separated)" }, { key: "demoUrl", label: "Demo URL" }, { key: "githubUrl", label: "GitHub URL" }]} apiPath="/api/admin/projects" onRefresh={onRefresh} />,
    gallery: <CrudList title="Gallery Images" items={data.galleryImages} fields={[{ key: "src", label: "Image URL" }, { key: "alt", label: "Alt Text" }, { key: "category", label: "Category" }]} apiPath="/api/admin/gallery" onRefresh={onRefresh} />,
    notes: <CrudList title="Notes" items={data.notes} fields={[{ key: "title", label: "Title" }, { key: "content", label: "Content", type: "textarea" }, { key: "date", label: "Date" }]} apiPath="/api/admin/notes" onRefresh={onRefresh} />,
    quotes: <CrudList title="Quotes" items={data.quotes} fields={[{ key: "text", label: "Quote", type: "textarea" }, { key: "context", label: "Context" }]} apiPath="/api/admin/quotes" onRefresh={onRefresh} />,
    blog: <CrudList title="Blog Posts" items={data.blogPosts} fields={[{ key: "title", label: "Title" }, { key: "date", label: "Date" }, { key: "excerpt", label: "Excerpt", type: "textarea" }, { key: "image", label: "Featured Image URL" }, { key: "tags", label: "Tags (comma separated)" }, { key: "content", label: "Content", type: "textarea" }]} apiPath="/api/admin/blog" onRefresh={onRefresh} />,
    store: <CrudList title="Store Products" items={data.storeProducts} fields={[{ key: "name", label: "Product Name" }, { key: "price", label: "Price" }, { key: "image", label: "Image URL" }, { key: "description", label: "Description", type: "textarea" }, { key: "category", label: "Category" }, { key: "rating", label: "Rating", type: "number" }]} apiPath="/api/admin/store" onRefresh={onRefresh} />,
    messages: (
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Messages ({data.messages.length}) {unreadMessages > 0 && <span className="text-emerald">{unreadMessages} new</span>}</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {data.messages.map((msg: any) => (
            <div key={msg.id} className={`p-3 rounded-xl border ${msg.read ? "border-border" : "border-emerald/40 bg-emerald/5"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{msg.name}</p>
                    <span className="text-[10px] text-muted-foreground">{msg.email}</span>
                  </div>
                  {msg.subject && <p className="text-xs text-foreground mt-0.5">{msg.subject}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {!msg.read && (
                    <button onClick={async () => { await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: msg.id, read: true }) }); onRefresh(); }}
                      className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors" title="Mark read">
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={async () => { if (!confirm("Delete?")) return; await fetch(`/api/admin/messages?id=${msg.id}`, { method: "DELETE" }); onRefresh(); }}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.messages.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No messages yet</p>}
        </div>
      </div>
    ),
    social: <CrudList title="Social Links" items={data.socialLinks} fields={[{ key: "platform", label: "Platform" }, { key: "url", label: "URL" }, { key: "icon", label: "Icon Name (Lucide)" }, { key: "handle", label: "Handle" }]} apiPath="/api/admin/social" onRefresh={onRefresh} />,
  };

  return (
    <div className="dot-pattern min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-card border-r border-border transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link href="/" className="text-lg font-bold text-foreground tracking-tight">
              <span className="text-emerald">A</span>lex<span className="text-emerald">.</span>
            </Link>
            <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => { setActiveSection(s.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === s.key ? "bg-emerald/10 text-emerald" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
                {s.key === "messages" && unreadMessages > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] bg-emerald text-white rounded-full">{unreadMessages}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border space-y-1">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Home className="w-4 h-4" /> Back to Site
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 md:ml-56">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-8 h-8 rounded-lg border border-border flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-foreground capitalize">{activeSection}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRefresh} className="text-[10px] text-muted-foreground hover:text-emerald transition-colors">Refresh</button>
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors">
                {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            )}
          </div>
        </header>
        <main className="p-4 md:p-6 max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-5">
            {sectionContent[activeSection]}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Main Admin Page ─── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        queueMicrotask(() => { setAuthed(true); setLoading(false); });
      } else {
        queueMicrotask(() => { setAuthed(false); setLoading(false); });
      }
    } catch {
      queueMicrotask(() => { setAuthed(false); setLoading(false); });
    }
  }, []);

  useEffect(() => { queueMicrotask(() => fetchData()); }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    setData(null);
  };

  if (loading) {
    return (
      <div className="dot-pattern min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <LoginPage onLogin={fetchData} />;
  }

  if (!data) return null;

  return <Dashboard data={data} onRefresh={fetchData} onLogout={handleLogout} />;
}
