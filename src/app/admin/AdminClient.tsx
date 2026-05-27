"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Sun, Moon, LogOut, Plus, Trash2, Edit3, Save, X, Home,
  User, GraduationCap, Briefcase, Code2, Star, Image as ImageIcon,
  Headphones, Video as VideoIcon, StickyNote, Quote, FileText,
  ShoppingCart, Mail, MessageSquare, Share2, Link as LinkIcon,
  Eye, EyeOff, Check, Upload, Link2, ChevronRight, GripVertical,
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Code, Quote as QuoteIcon,
} from "lucide-react";

/* ─── Types ─── */
interface AdminData {
  profile: any;
  education: any[];
  experience: any[];
  skills: any[];
  projects: any[];
  galleryImages: any[];
  audio: any[];
  video: any[];
  notes: any[];
  quotes: any[];
  code: any[];
  links: any[];
  blogPosts: any[];
  storeProducts: any[];
  messages: any[];
  guestbookEntries: any[];
  socialLinks: any[];
}

type Section =
  | "profile" | "education" | "experience" | "skills"
  | "projects" | "gallery" | "audio" | "video"
  | "notes" | "quotes" | "codes" | "links"
  | "blog" | "store" | "messages" | "guestbook" | "social";

type FieldType =
  | "text" | "textarea" | "number" | "image" | "html"
  | "category" | "checkbox" | "monospace";

interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
}

const SECTIONS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Code2 },
  { key: "projects", label: "Projects", icon: Star },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "audio", label: "Audio", icon: Headphones },
  { key: "video", label: "Video", icon: VideoIcon },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "quotes", label: "Quotes", icon: Quote },
  { key: "codes", label: "Codes", icon: Code2 },
  { key: "links", label: "Links", icon: Link2 },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "store", label: "Store", icon: ShoppingCart },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "guestbook", label: "Guestbook", icon: MessageSquare },
  { key: "social", label: "Social Links", icon: Share2 },
];

/* ─── Image Upload Component ─── */
function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
            mode === "upload"
              ? "bg-emerald/10 text-emerald"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="w-3 h-3 inline mr-1" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
            mode === "url"
              ? "bg-emerald/10 text-emerald"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="w-3 h-3 inline mr-1" />
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 rounded-lg border border-dashed border-border hover:border-emerald text-xs text-muted-foreground hover:text-emerald transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors"
        />
      )}

      {/* Preview */}
      {value && (
        <div className="relative mt-1">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-32 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── HTML Editor Component ─── */
type ToolbarAction = "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "code" | "quote";

const TOOLBAR_DEFS: { action: ToolbarAction; label: string; icon?: React.ElementType; title: string }[] = [
  { action: "bold", label: "B", icon: Bold, title: "Bold" },
  { action: "italic", label: "I", icon: Italic, title: "Italic" },
  { action: "h2", label: "H2", icon: Heading2, title: "Heading 2" },
  { action: "h3", label: "H3", icon: Heading3, title: "Heading 3" },
  { action: "ul", label: "UL", icon: List, title: "Unordered List" },
  { action: "ol", label: "OL", icon: ListOrdered, title: "Ordered List" },
  { action: "link", label: "Link", title: "Insert Link" },
  { action: "code", label: "Code", icon: Code, title: "Code" },
  { action: "quote", label: "Quote", icon: QuoteIcon, title: "Quote" },
];

function HtmlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
    }, 0);
  };

  const wrapLines = (wrapItem: string, wrapList: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end) || "Item";
    const lines = selected.split("\n").filter((l) => l.trim());
    const wrapped = lines.map((l) => `${wrapItem}${l.trim()}</li>`).join("\n");
    const newText =
      value.substring(0, start) + `${wrapList}\n${wrapped}\n</${wrapList === "<ul>" ? "ul" : "ol"}>` + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
    }, 0);
  };

  const handleToolbar = (action: ToolbarAction) => {
    switch (action) {
      case "bold": wrapSelection("<strong>", "</strong>"); break;
      case "italic": wrapSelection("<em>", "</em>"); break;
      case "h2": wrapSelection("<h2>", "</h2>"); break;
      case "h3": wrapSelection("<h3>", "</h3>"); break;
      case "ul": wrapLines("<li>", "<ul>"); break;
      case "ol": wrapLines("<li>", "<ol>"); break;
      case "link": {
        const url = prompt("Enter URL:");
        if (url) wrapSelection(`<a href="${url}">`, "</a>");
        break;
      }
      case "code": wrapSelection("<code>", "</code>"); break;
      case "quote": wrapSelection("<blockquote>", "</blockquote>"); break;
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-0.5 p-1 rounded-lg border border-border bg-muted/30">
        {TOOLBAR_DEFS.map((btn) => (
          <button
            key={btn.action}
            type="button"
            onClick={() => handleToolbar(btn.action)}
            title={btn.title}
            className="px-2 py-1 rounded text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {btn.icon ? <btn.icon className="w-3.5 h-3.5" /> : btn.label}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        rows={8}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write HTML content here..."
        className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors resize-y font-mono"
      />
    </div>
  );
}

/* ─── Enhanced CRUD List ─── */
function CrudList({
  title,
  items,
  fields,
  apiPath,
  onRefresh,
  noAdd = false,
  noEdit = false,
}: {
  title: string;
  items: any[];
  fields: FieldConfig[];
  apiPath: string;
  onRefresh: () => void;
  noAdd?: boolean;
  noEdit?: boolean;
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

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm({});
  };

  const handleSave = async () => {
    try {
      if (adding) {
        await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(apiPath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      cancelEdit();
      onRefresh();
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`${apiPath}?id=${id}`, { method: "DELETE" });
      onRefresh();
    } catch {
      alert("Delete failed");
    }
  };

  const toggleHidden = async (item: any) => {
    try {
      await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
      });
      onRefresh();
    } catch {
      alert("Toggle failed");
    }
  };

  const updateFormField = (key: string, val: any) => {
    setForm((prev: Record<string, any>) => ({ ...prev, [key]: val }));
  };

  const renderField = (f: FieldConfig) => {
    switch (f.type) {
      case "image":
        return (
          <ImageUpload
            value={form[f.key] || ""}
            onChange={(url) => updateFormField(f.key, url)}
          />
        );
      case "html":
        return (
          <HtmlEditor
            value={form[f.key] || ""}
            onChange={(val) => updateFormField(f.key, val)}
          />
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form[f.key]}
              onChange={(e) => updateFormField(f.key, e.target.checked)}
              className="w-4 h-4 rounded border-border text-emerald focus:ring-emerald"
            />
            <span className="text-xs text-foreground">{f.label}</span>
          </label>
        );
      case "textarea":
        return (
          <textarea
            rows={3}
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors resize-none"
          />
        );
      case "monospace":
        return (
          <textarea
            rows={6}
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors resize-y font-mono"
          />
        );
      case "number":
        return (
          <input
            type="number"
            step="any"
            value={form[f.key] ?? ""}
            onChange={(e) => updateFormField(f.key, e.target.value ? Number(e.target.value) : null)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors"
          />
        );
      case "category":
        return (
          <input
            type="text"
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder || "Category"}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors"
          />
        );
      default:
        return (
          <input
            type="text"
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald outline-none transition-colors"
          />
        );
    }
  };

  // Get display title for an item
  const getItemTitle = (item: any) => {
    const titleKeys = ["name", "title", "platform", "degree", "role"];
    for (const k of titleKeys) {
      if (item[k]) return String(item[k]);
    }
    return "Item";
  };

  // Get secondary info for an item
  const getItemSubtitle = (item: any) => {
    const subKeys = ["company", "institute", "category", "handle", "url", "language"];
    for (const k of subKeys) {
      if (item[k]) return String(item[k]);
    }
    return "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          {title} ({items.length})
        </h3>
        {!noAdd && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {(adding || editing) && (
        <div className="mb-4 p-4 rounded-xl border border-emerald/30 bg-emerald/5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-foreground">
              {adding ? "Add New" : "Edit"}
            </span>
            <button
              onClick={cancelEdit}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              {f.type !== "checkbox" && (
                <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">
                  {f.label}
                </label>
              )}
              {renderField(f)}
            </div>
          ))}
          {/* Order field */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">
              Order
            </label>
            <input
              type="number"
              value={form.order ?? 0}
              onChange={(e) => updateFormField("order", Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground focus:border-emerald outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors"
          >
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-colors group ${
              item.hidden
                ? "border-border/50 bg-muted/20 opacity-60"
                : "border-border hover:border-emerald/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-foreground truncate">
                    {getItemTitle(item)}
                  </p>
                  {item.hidden && (
                    <EyeOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                {getItemSubtitle(item) && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {getItemSubtitle(item)}
                  </p>
                )}
                {item.featured !== undefined && (
                  <span
                    className={`text-[10px] font-medium ${
                      item.featured ? "text-yellow-500" : "text-muted-foreground"
                    }`}
                  >
                    {item.featured ? "★ Featured" : ""}
                  </span>
                )}
                {item.published !== undefined && (
                  <span
                    className={`text-[10px] font-medium ${
                      item.published ? "text-emerald" : "text-muted-foreground"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {/* Hidden toggle */}
                <button
                  onClick={() => toggleHidden(item)}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                    item.hidden
                      ? "border-emerald/40 text-emerald hover:text-emerald"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                  title={item.hidden ? "Unhide" : "Hide"}
                >
                  {item.hidden ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                {!noEdit && (
                  <button
                    onClick={() => startEdit(item)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No items yet
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Profile Section ─── */
function ProfileSection({
  profile,
  onRefresh,
}: {
  profile: any;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState<Record<string, any>>(() => ({ ...(profile || {}) }));

  const handleSave = async () => {
    try {
      await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onRefresh();
      alert("Profile saved!");
    } catch {
      alert("Save failed");
    }
  };

  const updateField = (key: string, val: any) => {
    setForm((prev: Record<string, any>) => ({ ...prev, [key]: val }));
  };

  const textFields = [
    { key: "name", label: "Name" },
    { key: "tagline", label: "Tagline" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "website", label: "Website" },
    { key: "resume", label: "Resume URL" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Profile</h3>
      {textFields.map((f) => (
        <div key={f.key}>
          <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">
            {f.label}
          </label>
          <input
            type="text"
            value={form[f.key] || ""}
            onChange={(e) => updateField(f.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground focus:border-emerald outline-none transition-colors"
          />
        </div>
      ))}
      {/* Avatar with image upload */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">
          Avatar
        </label>
        <ImageUpload value={form.avatar || ""} onChange={(url) => updateField("avatar", url)} />
      </div>
      {/* About textarea */}
      <div>
        <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">
          About
        </label>
        <textarea
          rows={4}
          value={form.about || ""}
          onChange={(e) => updateField("about", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-xs text-foreground focus:border-emerald outline-none transition-colors resize-none"
        />
      </div>
      {/* Hidden toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.hidden}
            onChange={(e) => updateField("hidden", e.target.checked)}
            className="w-4 h-4 rounded border-border text-emerald focus:ring-emerald"
          />
          <span className="text-xs text-foreground">Hidden</span>
        </label>
      </div>
      <button
        onClick={handleSave}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald-hover transition-colors"
      >
        <Save className="w-3 h-3" /> Save Profile
      </button>
    </div>
  );
}

/* ─── Messages Section ─── */
function MessagesSection({
  messages,
  onRefresh,
}: {
  messages: any[];
  onRefresh: () => void;
}) {
  const unreadCount = messages.filter((m: any) => !m.read).length;

  const markRead = async (id: string) => {
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    onRefresh();
  };

  const toggleHidden = async (item: any) => {
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
    });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Messages ({messages.length}){" "}
        {unreadCount > 0 && (
          <span className="text-emerald">{unreadCount} new</span>
        )}
      </h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl border transition-colors group ${
              msg.hidden
                ? "border-border/50 bg-muted/20 opacity-60"
                : msg.read
                ? "border-border"
                : "border-emerald/40 bg-emerald/5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    {msg.name}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {msg.email}
                  </span>
                  {msg.hidden && (
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                {msg.subject && (
                  <p className="text-xs text-foreground mt-0.5">{msg.subject}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                  {msg.message}
                </p>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
                {!msg.read && (
                  <span className="text-[10px] font-medium text-emerald">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => toggleHidden(msg)}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                    msg.hidden
                      ? "border-emerald/40 text-emerald"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                  title={msg.hidden ? "Unhide" : "Hide"}
                >
                  {msg.hidden ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                {!msg.read && (
                  <button
                    onClick={() => markRead(msg.id)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors"
                    title="Mark read"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No messages yet
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Guestbook Section ─── */
function GuestbookSection({
  entries,
  onRefresh,
}: {
  entries: any[];
  onRefresh: () => void;
}) {
  const toggleHidden = async (item: any) => {
    await fetch("/api/admin/guestbook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
    });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/admin/guestbook?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Guestbook ({entries.length})
      </h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {entries.map((entry: any) => (
          <div
            key={entry.id}
            className={`p-3 rounded-xl border transition-colors group ${
              entry.hidden
                ? "border-border/50 bg-muted/20 opacity-60"
                : "border-border hover:border-emerald/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    {entry.name}
                  </p>
                  {entry.location && (
                    <span className="text-[10px] text-muted-foreground">
                      {entry.location}
                    </span>
                  )}
                  {entry.hidden && (
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                {entry.email && (
                  <p className="text-[10px] text-muted-foreground">
                    {entry.email}
                  </p>
                )}
                {entry.phone && (
                  <p className="text-[10px] text-muted-foreground">
                    {entry.phone}
                  </p>
                )}
                {entry.message && (
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                    {entry.message}
                  </p>
                )}
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => toggleHidden(entry)}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                    entry.hidden
                      ? "border-emerald/40 text-emerald"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                  title={entry.hidden ? "Unhide" : "Hide"}
                >
                  {entry.hidden ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No entries yet
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Section Field Configurations ─── */
const SECTION_FIELDS: Record<string, FieldConfig[]> = {
  education: [
    { key: "degree", label: "Degree" },
    { key: "institute", label: "Institute" },
    { key: "year", label: "Year" },
    { key: "detail", label: "Detail", type: "textarea" },
  ],
  experience: [
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "year", label: "Year" },
    { key: "detail", label: "Detail", type: "textarea" },
  ],
  skills: [{ key: "name", label: "Skill Name" }],
  projects: [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "featuredImage", label: "Featured Image", type: "image" },
    { key: "image", label: "Image", type: "image" },
    { key: "tags", label: "Tags (comma separated)" },
    { key: "category", label: "Category", type: "category" },
    { key: "demoUrl", label: "Demo URL" },
    { key: "githubUrl", label: "GitHub URL" },
    { key: "featured", label: "Featured", type: "checkbox" },
  ],
  gallery: [
    { key: "src", label: "Image", type: "image" },
    { key: "alt", label: "Alt Text" },
    { key: "category", label: "Category", type: "category" },
  ],
  audio: [
    { key: "title", label: "Title" },
    { key: "url", label: "URL" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category", label: "Category", type: "category" },
  ],
  video: [
    { key: "title", label: "Title" },
    { key: "url", label: "URL" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category", label: "Category", type: "category" },
  ],
  notes: [
    { key: "title", label: "Title" },
    { key: "content", label: "Content", type: "textarea" },
    { key: "date", label: "Date" },
  ],
  quotes: [
    { key: "text", label: "Quote", type: "textarea" },
    { key: "context", label: "Context" },
  ],
  codes: [
    { key: "title", label: "Title" },
    { key: "content", label: "Code", type: "monospace" },
    { key: "language", label: "Language" },
    { key: "description", label: "Description" },
  ],
  links: [
    { key: "title", label: "Title" },
    { key: "url", label: "URL" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category", type: "category" },
  ],
  blog: [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "featuredImage", label: "Featured Image", type: "image" },
    { key: "image", label: "Image", type: "image" },
    { key: "tags", label: "Tags (comma separated)" },
    { key: "category", label: "Category", type: "category" },
    { key: "content", label: "Content", type: "html" },
    { key: "published", label: "Published", type: "checkbox" },
  ],
  store: [
    { key: "name", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "featuredImage", label: "Featured Image", type: "image" },
    { key: "image", label: "Image", type: "image" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category", label: "Category", type: "category" },
    { key: "rating", label: "Rating", type: "number" },
  ],
  social: [
    { key: "platform", label: "Platform" },
    { key: "url", label: "URL" },
    { key: "icon", label: "Icon Name (Lucide)" },
    { key: "handle", label: "Handle" },
  ],
};

const SECTION_API: Record<string, string> = {
  education: "/api/admin/education",
  experience: "/api/admin/experience",
  skills: "/api/admin/skills",
  projects: "/api/admin/projects",
  gallery: "/api/admin/gallery",
  audio: "/api/admin/audio",
  video: "/api/admin/video",
  notes: "/api/admin/notes",
  quotes: "/api/admin/quotes",
  codes: "/api/admin/code",
  links: "/api/admin/link",
  blog: "/api/admin/blog",
  store: "/api/admin/store",
  social: "/api/admin/social",
};

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
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
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
          <Link
            href="/"
            className="text-2xl font-bold text-foreground tracking-tight"
          >
            <span className="text-emerald">A</span>lex
            <span className="text-emerald">.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h1 className="text-lg font-semibold text-foreground text-center mb-4">
            Sign In
          </h1>
          {error && (
            <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-500 text-xs text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@alex.dev"
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••"
                className="w-full px-3 py-2 rounded-xl border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald text-white text-sm font-semibold hover:bg-emerald-hover transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="flex justify-center mt-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-xs text-muted-foreground hover:text-emerald transition-colors flex items-center gap-1"
            >
              {theme === "dark" ? (
                <Sun className="w-3 h-3" />
              ) : (
                <Moon className="w-3 h-3" />
              )}
              Toggle theme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard({
  data,
  onRefresh,
  onLogout,
}: {
  data: AdminData;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    onLogout();
  };

  const unreadMessages = data.messages?.filter((m: any) => !m.read).length || 0;

  const renderSectionContent = (): React.ReactNode => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection profile={data.profile} onRefresh={onRefresh} />;

      case "messages":
        return (
          <MessagesSection messages={data.messages} onRefresh={onRefresh} />
        );

      case "guestbook":
        return (
          <GuestbookSection
            entries={data.guestbookEntries}
            onRefresh={onRefresh}
          />
        );

      default: {
        const fields = SECTION_FIELDS[activeSection];
        const apiPath = SECTION_API[activeSection];
        if (!fields || !apiPath) return null;

        // Map data keys to section keys
        const dataKeyMap: Record<string, string> = {
          education: "education",
          experience: "experience",
          skills: "skills",
          projects: "projects",
          gallery: "galleryImages",
          audio: "audio",
          video: "video",
          notes: "notes",
          quotes: "quotes",
          codes: "code",
          links: "links",
          blog: "blogPosts",
          store: "storeProducts",
          social: "socialLinks",
        };

        const items = (data as any)[dataKeyMap[activeSection]] || [];
        const sectionLabel =
          SECTIONS.find((s) => s.key === activeSection)?.label || activeSection;

        return (
          <CrudList
            title={sectionLabel}
            items={items}
            fields={fields}
            apiPath={apiPath}
            onRefresh={onRefresh}
          />
        );
      }
    }
  };

  return (
    <div className="dot-pattern min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-card border-r border-border transform transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link
              href="/"
              className="text-lg font-bold text-foreground tracking-tight"
            >
              <span className="text-emerald">A</span>lex
              <span className="text-emerald">.</span>
            </Link>
            <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setActiveSection(s.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === s.key
                    ? "bg-emerald/10 text-emerald"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <s.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{s.label}</span>
                {s.key === "messages" && unreadMessages > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] bg-emerald text-white rounded-full flex-shrink-0">
                    {unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" /> Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg border border-border flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-foreground capitalize">
              {SECTIONS.find((s) => s.key === activeSection)?.label ||
                activeSection}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="text-[10px] text-muted-foreground hover:text-emerald transition-colors"
            >
              Refresh
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-emerald transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-yellow-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </header>
        <main className="p-4 md:p-6 max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-5">
            {renderSectionContent()}
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
        queueMicrotask(() => {
          setAuthed(true);
          setLoading(false);
        });
      } else {
        queueMicrotask(() => {
          setAuthed(false);
          setLoading(false);
        });
      }
    } catch {
      queueMicrotask(() => {
        setAuthed(false);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchData());
  }, [fetchData]);

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
