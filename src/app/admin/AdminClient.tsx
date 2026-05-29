"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sun, Moon, LogOut, Plus, Trash2, Edit3, Save, X, Home,
  User, GraduationCap, Briefcase, Code2, Star, Image as ImageIcon,
  Headphones, Video as VideoIcon, StickyNote, Quote, FileText,
  ShoppingCart, Mail, MessageSquare, Share2, Link as LinkIcon,
  Eye, EyeOff, Check, Upload, Link2, ChevronRight, ChevronLeft,
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Code, Quote as QuoteIcon,
  LayoutDashboard, Search, RefreshCw, ArrowUp, ArrowDown, Loader2,
  ExternalLink, Clock, Users, FolderOpen, Tag, ChevronDown, Menu,
  Globe, Phone, MapPin, Mail as MailIcon, Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  welcomePopups: any[];
}

type Section =
  | "overview" | "profile" | "education" | "experience" | "skills"
  | "projects" | "gallery" | "audio" | "video"
  | "notes" | "quotes" | "codes" | "links"
  | "blog" | "store" | "messages" | "guestbook" | "social" | "popup";

type FieldType =
  | "text" | "textarea" | "number" | "image" | "html"
  | "category" | "checkbox" | "monospace" | "select";

interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

const SECTIONS: { key: Section; label: string; icon: React.ElementType; group?: string }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "profile", label: "Profile", icon: User },
  { key: "education", label: "Education", icon: GraduationCap, group: "Content" },
  { key: "experience", label: "Experience", icon: Briefcase, group: "Content" },
  { key: "skills", label: "Skills", icon: Code2, group: "Content" },
  { key: "projects", label: "Projects", icon: Star, group: "Content" },
  { key: "blog", label: "Blog", icon: FileText, group: "Content" },
  { key: "store", label: "Store", icon: ShoppingCart, group: "Content" },
  { key: "gallery", label: "Gallery", icon: ImageIcon, group: "Media" },
  { key: "audio", label: "Audio", icon: Headphones, group: "Media" },
  { key: "video", label: "Video", icon: VideoIcon, group: "Media" },
  { key: "notes", label: "Notes", icon: StickyNote, group: "More" },
  { key: "quotes", label: "Quotes", icon: Quote, group: "More" },
  { key: "codes", label: "Code Snippets", icon: Code2, group: "More" },
  { key: "links", label: "Links", icon: Link2, group: "More" },
  { key: "social", label: "Social Links", icon: Share2, group: "More" },
  { key: "messages", label: "Messages", icon: Mail, group: "Interactions" },
  { key: "guestbook", label: "Guestbook", icon: MessageSquare, group: "Interactions" },
  { key: "popup", label: "Welcome Popup", icon: Sparkles, group: "Content" },
];

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
    { key: "buyUrl", label: "Buy Button URL (custom link)" },
    { key: "featured", label: "Featured Product", type: "checkbox" },
  ],
  guestbook: [
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "message", label: "Message", type: "textarea" },
  ],
  popup: [
    { key: "title", label: "Popup Title" },
    { key: "message", label: "Message", type: "textarea" },
    { key: "imageUrl", label: "Image", type: "image" },
    { key: "buttonText", label: "Button Text" },
    { key: "buttonUrl", label: "Button URL" },
    { key: "enabled", label: "Enabled", type: "checkbox" },
    { key: "showOnce", label: "Show Only Once (remember dismissal)", type: "checkbox" },
  ],
  social: [
    { key: "platform", label: "Platform", type: "select", options: [
      { label: "GitHub", value: "GitHub" }, { label: "LinkedIn", value: "LinkedIn" },
      { label: "Twitter / X", value: "Twitter" }, { label: "YouTube", value: "YouTube" },
      { label: "Instagram", value: "Instagram" }, { label: "Facebook", value: "Facebook" },
      { label: "Dribbble", value: "Dribbble" }, { label: "Behance", value: "Behance" },
      { label: "Medium", value: "Medium" }, { label: "Dev.to", value: "Dev.to" },
      { label: "Telegram", value: "Telegram" }, { label: "Discord", value: "Discord" },
      { label: "Other", value: "Other" },
    ]},
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
  guestbook: "/api/admin/guestbook",
  popup: "/api/admin/popup",
};

const DATA_KEY_MAP: Record<string, string> = {
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
  guestbook: "guestbookEntries",
  popup: "welcomePopups",
};

/* ─── Utility: cn helper ─── */
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Image Upload Component ─── */
function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder: folder || "portfolio" }),
        });
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          toast.success("Image uploaded successfully");
        } else {
          toast.error(data.error || "Upload failed");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("upload")}
          className={cn("text-xs h-7", mode === "upload" && "bg-emerald-600 hover:bg-emerald-700")}
        >
          <Upload className="w-3 h-3 mr-1" /> Upload
        </Button>
        <Button
          type="button"
          variant={mode === "url" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("url")}
          className={cn("text-xs h-7", mode === "url" && "bg-emerald-600 hover:bg-emerald-700")}
        >
          <Link2 className="w-3 h-3 mr-1" /> URL
        </Button>
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-dashed w-full"
          >
            {uploading ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-3 h-3 mr-1" /> Choose Image</>
            )}
          </Button>
        </div>
      ) : (
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="text-xs"
        />
      )}

      {value && (
        <div className="relative mt-1 group">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-40 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── HTML Editor Component ─── */
type ToolbarAction = "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "code" | "quote" | "image";

const TOOLBAR_DEFS: { action: ToolbarAction; label: string; icon?: React.ElementType; title: string }[] = [
  { action: "bold", label: "B", icon: Bold, title: "Bold" },
  { action: "italic", label: "I", icon: Italic, title: "Italic" },
  { action: "h2", label: "H2", icon: Heading2, title: "Heading 2" },
  { action: "h3", label: "H3", icon: Heading3, title: "Heading 3" },
  { action: "ul", label: "UL", icon: List, title: "Unordered List" },
  { action: "ol", label: "OL", icon: ListOrdered, title: "Ordered List" },
  { action: "link", label: "Link", icon: LinkIcon, title: "Insert Link" },
  { action: "code", label: "Code", icon: Code, title: "Code Block" },
  { action: "quote", label: "Quote", icon: QuoteIcon, title: "Blockquote" },
  { action: "image", label: "Img", icon: ImageIcon, title: "Insert Image" },
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
    const closeTag = wrapList === "<ul>" ? "ul" : "ol";
    const newText = value.substring(0, start) + `${wrapList}\n${wrapped}\n</${closeTag}>` + value.substring(end);
    onChange(newText);
    setTimeout(() => ta.focus(), 0);
  };

  const handleToolbar = async (action: ToolbarAction) => {
    switch (action) {
      case "bold": wrapSelection("<strong>", "</strong>"); break;
      case "italic": wrapSelection("<em>", "</em>"); break;
      case "h2": wrapSelection("<h2>", "</h2>"); break;
      case "h3": wrapSelection("<h3>", "</h3>"); break;
      case "ul": wrapLines("<li>", "<ul>"); break;
      case "ol": wrapLines("<li>", "<ol>"); break;
      case "link": {
        const url = prompt("Enter URL:");
        if (url) wrapSelection(`<a href="${url}" target="_blank">`, "</a>");
        break;
      }
      case "code": wrapSelection("<pre><code>", "</code></pre>"); break;
      case "quote": wrapSelection("<blockquote>", "</blockquote>"); break;
      case "image": {
        const imgUrl = prompt("Enter image URL:");
        if (imgUrl) wrapSelection(`<img src="${imgUrl}" alt="Image" />`, "");
        break;
      }
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-0.5 p-1.5 rounded-lg border border-border bg-muted/50">
        {TOOLBAR_DEFS.map((btn) => (
          <Button
            key={btn.action}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleToolbar(btn.action)}
            title={btn.title}
            className="h-7 w-7 p-0"
          >
            {btn.icon ? <btn.icon className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{btn.label}</span>}
          </Button>
        ))}
      </div>
      <Textarea
        ref={textareaRef as any}
        rows={10}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write HTML content here..."
        className="font-mono text-xs resize-y min-h-[200px]"
      />
    </div>
  );
}

/* ─── Delete Confirmation Dialog ─── */
function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&quot;{itemName}&quot;</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Trash2 className="w-3 h-3 mr-1" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  gridMode = false,
}: {
  title: string;
  items: any[];
  fields: FieldConfig[];
  apiPath: string;
  onRefresh: () => void;
  noAdd?: boolean;
  noEdit?: boolean;
  gridMode?: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const startEdit = (item: any) => {
    setEditing(item.id);
    setForm({ ...item });
    setAdding(false);
    setDialogOpen(true);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({});
    setDialogOpen(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm({});
    setDialogOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = adding
        ? await fetch(apiPath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })
        : await fetch(apiPath, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
      if (res.ok) {
        toast.success(adding ? "Created successfully" : "Updated successfully");
        cancelEdit();
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiPath}?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        onRefresh();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleHidden = async (item: any) => {
    try {
      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
      });
      if (res.ok) {
        toast.success(item.hidden ? "Now visible" : "Now hidden");
        onRefresh();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const toggleFeatured = async (item: any) => {
    try {
      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, featured: !item.featured }),
      });
      if (res.ok) {
        toast.success(item.featured ? "Unfeatured" : "Featured");
        onRefresh();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const moveOrder = async (item: any, direction: "up" | "down") => {
    try {
      const newOrder = (item.order || 0) + (direction === "up" ? -1 : 1);
      await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, order: newOrder }),
      });
      onRefresh();
    } catch {
      toast.error("Reorder failed");
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
          <div className="flex items-center gap-3 py-1">
            <Switch
              checked={!!form[f.key]}
              onCheckedChange={(checked) => updateFormField(f.key, checked)}
            />
            <Label className="text-sm cursor-pointer">{f.label}</Label>
          </div>
        );
      case "textarea":
        return (
          <Textarea
            rows={3}
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
          />
        );
      case "monospace":
        return (
          <Textarea
            rows={8}
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="font-mono text-xs"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            step="any"
            value={form[f.key] ?? ""}
            onChange={(e) => updateFormField(f.key, e.target.value ? Number(e.target.value) : null)}
            placeholder={f.placeholder}
          />
        );
      case "category":
        return (
          <Input
            type="text"
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder || "Category"}
          />
        );
      case "select":
        return (
          <Select value={form[f.key] || ""} onValueChange={(val) => updateFormField(f.key, val)}>
            <SelectTrigger><SelectValue placeholder={`Select ${f.label}`} /></SelectTrigger>
            <SelectContent>
              {f.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            value={form[f.key] || ""}
            onChange={(e) => updateFormField(f.key, e.target.value)}
            placeholder={f.placeholder}
          />
        );
    }
  };

  const getItemTitle = (item: any) => {
    const titleKeys = ["name", "title", "platform", "degree", "role"];
    for (const k of titleKeys) {
      if (item[k]) return String(item[k]);
    }
    return "Item";
  };

  const getItemSubtitle = (item: any) => {
    const subKeys = ["company", "institute", "category", "handle", "url", "language"];
    for (const k of subKeys) {
      if (item[k]) return String(item[k]);
    }
    return "";
  };

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      return Object.values(item).some((val) =>
        String(val || "").toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="text-xs">{items.length}</Badge>
        </div>
        {!noAdd && (
          <Button onClick={startAdd} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add New
          </Button>
        )}
      </div>

      {/* Search */}
      {items.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9 text-sm"
          />
        </div>
      )}

      {/* Grid mode for gallery */}
      {gridMode ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative group rounded-xl border overflow-hidden transition-all",
                item.hidden && "opacity-50"
              )}
            >
              {item.src ? (
                <img src={item.src} alt={item.alt || ""} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-2">
                <p className="text-xs truncate">{item.alt || "No alt text"}</p>
                {item.category && (
                  <Badge variant="outline" className="text-[10px] mt-1">{item.category}</Badge>
                )}
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleHidden(item)}
                >
                  {item.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => startEdit(item)}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setDeleteTarget({ id: item.id, name: item.alt || "Image" })}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No items yet
            </div>
          )}
        </div>
      ) : (
        /* List mode */
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "p-3 rounded-xl border transition-all group hover:shadow-sm",
                  item.hidden ? "border-border/50 bg-muted/20 opacity-60" : "border-border hover:border-emerald-500/30"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{getItemTitle(item)}</p>
                      {item.hidden && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          <EyeOff className="w-2.5 h-2.5 mr-0.5" /> Hidden
                        </Badge>
                      )}
                      {item.featured && (
                        <Badge className="text-[10px] h-5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <Star className="w-2.5 h-2.5 mr-0.5" /> Featured
                        </Badge>
                      )}
                      {item.published !== undefined && (
                        <Badge className={cn("text-[10px] h-5", item.published ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground")}>
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      )}
                      {getItemSubtitle(item) && (
                        <span className="text-xs text-muted-foreground truncate">
                          {getItemSubtitle(item)}
                        </span>
                      )}
                    </div>
                    {item.tags && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {item.tags.split(",").map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] h-4 px-1.5">{tag.trim()}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {/* Reorder */}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveOrder(item, "up")} title="Move up">
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveOrder(item, "down")} title="Move down">
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-7 w-7", item.hidden ? "text-emerald-600" : "")}
                      onClick={() => toggleHidden(item)}
                      title={item.hidden ? "Unhide" : "Hide"}
                    >
                      {item.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    {item.featured !== undefined && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-7 w-7", item.featured ? "text-yellow-500" : "")}
                        onClick={() => toggleFeatured(item)}
                        title={item.featured ? "Unfeature" : "Feature"}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    )}
                    {!noEdit && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}>
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => setDeleteTarget({ id: item.id, name: getItemTitle(item) })}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No items yet</p>
              {!noAdd && (
                <Button variant="ghost" size="sm" onClick={startAdd} className="mt-2 text-emerald-600">
                  <Plus className="w-4 h-4 mr-1" /> Create first item
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) cancelEdit(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{adding ? "Add New" : "Edit"} {title}</DialogTitle>
            <DialogDescription>
              {adding ? "Fill in the details below to create a new item." : "Update the details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "checkbox" ? "" : "space-y-1.5"}>
                {f.type !== "checkbox" && (
                  <Label className="text-sm font-medium">{f.label}</Label>
                )}
                {renderField(f)}
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Order</Label>
              <Input
                type="number"
                value={form.order ?? 0}
                onChange={(e) => updateFormField("order", Number(e.target.value))}
                className="w-28"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Hidden</Label>
              <Switch
                checked={!!form.hidden}
                onCheckedChange={(checked) => updateFormField("hidden", checked)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name || ""}
        loading={deleting}
      />
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
  const [saving, setSaving] = useState(false);

  // Sync form with profile when it changes (e.g. after refresh)
  const profileStr = JSON.stringify(profile);
  useEffect(() => {
    if (profile) {
      queueMicrotask(() => setForm({ ...profile }));
    }
  }, [profileStr]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Profile saved successfully");
        onRefresh();
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  const updateField = (key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Profile Settings</h3>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <ImageUpload value={form.avatar || ""} onChange={(url) => updateField("avatar", url)} folder="portfolio/avatars" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Name</Label>
              <Input value={form.name || ""} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Tagline</Label>
              <Input value={form.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>About</Label>
            <Textarea rows={4} value={form.about || ""} onChange={(e) => updateField("about", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><MailIcon className="w-3.5 h-3.5" /> Email</Label>
              <Input type="email" value={form.email || ""} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input value={form.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</Label>
              <Input value={form.location || ""} onChange={(e) => updateField("location", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</Label>
              <Input value={form.website || ""} onChange={(e) => updateField("website", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Resume URL</Label>
            <Input value={form.resume || ""} onChange={(e) => updateField("resume", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch checked={!!form.hidden} onCheckedChange={(checked) => updateField("hidden", checked)} />
            <Label>Hide profile from public site</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Overview Section ─── */
function OverviewSection({ data }: { data: AdminData }) {
  const stats = [
    { label: "Projects", count: data.projects?.length || 0, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Blog Posts", count: data.blogPosts?.length || 0, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Skills", count: data.skills?.length || 0, icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Gallery", count: data.galleryImages?.length || 0, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Messages", count: data.messages?.filter((m: any) => !m.read).length || 0, icon: Mail, color: "text-red-500", bg: "bg-red-500/10", subtext: "unread" },
    { label: "Store", count: data.storeProducts?.length || 0, icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Experience", count: data.experience?.length || 0, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Education", count: data.education?.length || 0, icon: GraduationCap, color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  const recentMessages = (data.messages || []).slice(0, 5);
  const recentGuestbook = (data.guestbookEntries || []).slice(0, 3);
  const publishedPosts = (data.blogPosts || []).filter((p: any) => p.published).length;
  const featuredProjects = (data.projects || []).filter((p: any) => p.featured).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here&apos;s a summary of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{stat.label} {stat.subtext && `(${stat.subtext})`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold">{publishedPosts}</p>
              <p className="text-xs text-muted-foreground">Published posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-lg font-bold">{featuredProjects}</p>
              <p className="text-xs text-muted-foreground">Featured projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Share2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold">{data.socialLinks?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Social links</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" /> Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg: any) => (
                  <div key={msg.id} className={cn("p-3 rounded-lg border", !msg.read && "border-emerald-500/30 bg-emerald-500/5")}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{msg.name}</p>
                      {!msg.read && <Badge className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600">New</Badge>}
                    </div>
                    {msg.subject && <p className="text-xs text-muted-foreground mt-0.5">{msg.subject}</p>}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Guestbook */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Recent Guestbook
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGuestbook.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No entries yet</p>
            ) : (
              <div className="space-y-3">
                {recentGuestbook.map((entry: any) => (
                  <div key={entry.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{entry.name}</p>
                      {entry.location && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          <MapPin className="w-2.5 h-2.5 mr-0.5" /> {entry.location}
                        </Badge>
                      )}
                    </div>
                    {entry.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{entry.message}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const unreadCount = messages.filter((m: any) => !m.read).length;

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m: any) =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  const markRead = async (id: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      toast.success("Marked as read");
      onRefresh();
    } catch {
      toast.error("Failed");
    }
  };

  const markUnread = async (id: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: false }),
      });
      toast.success("Marked as unread");
      onRefresh();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        onRefresh();
      }
    } catch {
      toast.error("Delete failed");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleHidden = async (item: any) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
      });
      toast.success(item.hidden ? "Now visible" : "Now hidden");
      onRefresh();
    } catch {
      toast.error("Toggle failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Messages</h3>
          <Badge variant="secondary" className="text-xs">{messages.length}</Badge>
          {unreadCount > 0 && (
            <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {messages.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="pl-9 text-sm"
          />
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {filteredMessages.map((msg: any) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all group",
                msg.hidden ? "border-border/50 bg-muted/20 opacity-60" :
                !msg.read ? "border-emerald-500/30 bg-emerald-500/5 hover:shadow-sm" :
                "border-border hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn("text-sm", !msg.read && "font-semibold")}>{msg.name}</p>
                    <span className="text-xs text-muted-foreground">{msg.email}</span>
                    {!msg.read && <Badge className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600">New</Badge>}
                    {msg.hidden && <Badge variant="outline" className="text-[10px] h-5"><EyeOff className="w-2.5 h-2.5 mr-0.5" />Hidden</Badge>}
                  </div>
                  {msg.subject && <p className="text-sm font-medium mt-1">{msg.subject}</p>}
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!msg.read ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead(msg.id)} title="Mark read">
                      <Check className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markUnread(msg.id)} title="Mark unread">
                      <Mail className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleHidden(msg)} title={msg.hidden ? "Unhide" : "Hide"}>
                    {msg.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setDeleteTarget({ id: msg.id, name: msg.name })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredMessages.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No messages yet</div>
        )}
      </div>

      {/* Message detail dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => { if (!open) setSelectedMessage(null); }}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedMessage.subject || "Message"}
                  {!selectedMessage.read && <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600">New</Badge>}
                </DialogTitle>
                <DialogDescription>
                  From {selectedMessage.name} ({selectedMessage.email})
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                <p className="text-xs text-muted-foreground mt-3">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>Close</Button>
                {!selectedMessage.read && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { markRead(selectedMessage.id); setSelectedMessage(null); }}>
                    <Check className="w-3 h-3 mr-1" /> Mark as Read
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => { setDeleteTarget({ id: selectedMessage.id, name: selectedMessage.name }); setSelectedMessage(null); }}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name || ""}
        loading={deleting}
      />
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
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleHidden = async (item: any) => {
    try {
      await fetch("/api/admin/guestbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
      });
      toast.success(item.hidden ? "Now visible" : "Now hidden");
      onRefresh();
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/guestbook?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry deleted");
        onRefresh();
      }
    } catch {
      toast.error("Delete failed");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">Guestbook</h3>
        <Badge variant="secondary" className="text-xs">{entries.length}</Badge>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {entries.map((entry: any) => (
          <div
            key={entry.id}
            className={cn(
              "p-4 rounded-xl border transition-all group hover:shadow-sm",
              entry.hidden ? "border-border/50 bg-muted/20 opacity-60" : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{entry.name}</p>
                  {entry.location && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      <MapPin className="w-2.5 h-2.5 mr-0.5" /> {entry.location}
                    </Badge>
                  )}
                  {entry.hidden && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      <EyeOff className="w-2.5 h-2.5 mr-0.5" /> Hidden
                    </Badge>
                  )}
                </div>
                {entry.email && <p className="text-xs text-muted-foreground mt-0.5">{entry.email}</p>}
                {entry.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.message}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleHidden(entry)}>
                  {entry.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setDeleteTarget({ id: entry.id, name: entry.name })}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No entries yet</div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name || ""}
        loading={deleting}
      />
    </div>
  );
}

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
        toast.success("Welcome back!");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-emerald-500/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            <span className="text-emerald-500">A</span>lex<span className="text-emerald-500">.</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">Admin Dashboard</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@alex.dev"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-10">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6 gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-xs text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
              Toggle theme
            </Button>
          )}
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Home className="w-3 h-3 mr-1" /> Back to site
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Dashboard Layout ─── */
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
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      queueMicrotask(() => setMounted(true));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    toast.success("Signed out");
    onLogout();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
    toast.success("Data refreshed");
  };

  const unreadMessages = data.messages?.filter((m: any) => !m.read).length || 0;

  const renderSectionContent = (): React.ReactNode => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection data={data} />;
      case "profile":
        return <ProfileSection profile={data.profile} onRefresh={onRefresh} />;
      case "messages":
        return <MessagesSection messages={data.messages} onRefresh={onRefresh} />;
      case "guestbook":
        return <GuestbookSection entries={data.guestbookEntries} onRefresh={onRefresh} />;
      default: {
        const fields = SECTION_FIELDS[activeSection];
        const apiPath = SECTION_API[activeSection];
        if (!fields || !apiPath) return null;
        const items = (data as any)[DATA_KEY_MAP[activeSection]] || [];
        const sectionLabel = SECTIONS.find((s) => s.key === activeSection)?.label || activeSection;
        const isGrid = activeSection === "gallery";
        return (
          <CrudList
            title={sectionLabel}
            items={items}
            fields={fields}
            apiPath={apiPath}
            onRefresh={onRefresh}
            gridMode={isGrid}
          />
        );
      }
    }
  };

  // Group sections
  const groupedSections = useMemo(() => {
    const groups: { label: string; sections: typeof SECTIONS }[] = [];
    let currentGroup = "";
    for (const s of SECTIONS) {
      const group = s.group || (s.key === "overview" ? "__main" : s.key === "profile" ? "__main" : "Other");
      if (group !== currentGroup) {
        groups.push({ label: group === "__main" ? "" : group, sections: [] });
        currentGroup = group;
      }
      groups[groups.length - 1].sections.push(s);
    }
    return groups;
  }, []);

  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-60";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-card border-r border-border transform transition-all duration-300 md:translate-x-0",
          sidebarWidth,
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {!sidebarCollapsed && (
              <Link href="/" className="text-lg font-bold tracking-tight">
                <span className="text-emerald-500">A</span>lex<span className="text-emerald-500">.</span>
              </Link>
            )}
            {sidebarCollapsed && (
              <Link href="/" className="text-lg font-bold mx-auto">
                <span className="text-emerald-500">A</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {groupedSections.map((group, gi) => (
                <div key={gi}>
                  {group.label && !sidebarCollapsed && (
                    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </p>
                  )}
                  {group.label && sidebarCollapsed && (
                    <Separator className="my-2" />
                  )}
                  {group.sections.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setActiveSection(s.key);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        activeSection === s.key
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        sidebarCollapsed && "justify-center px-0"
                      )}
                      title={sidebarCollapsed ? s.label : undefined}
                    >
                      <s.icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="truncate">{s.label}</span>
                          {s.key === "messages" && unreadMessages > 0 && (
                            <span className="ml-auto px-1.5 py-0.5 text-[9px] bg-emerald-500 text-white rounded-full flex-shrink-0">
                              {unreadMessages}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Bottom nav */}
          <div className="p-2 border-t border-border space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <Home className="w-4 h-4" />
              {!sidebarCollapsed && <span>Back to Site</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "md:ml-16" : "md:ml-60"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border h-14 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {(() => {
                const section = SECTIONS.find((s) => s.key === activeSection);
                return section ? (
                  <>
                    <section.icon className="w-4 h-4 text-emerald-500" />
                    <h1 className="text-sm font-semibold">{section.label}</h1>
                  </>
                ) : null;
              })()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8"
              title="Refresh data"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-card p-5 md:p-6"
            >
              {renderSectionContent()}
            </motion.div>
          </AnimatePresence>
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
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    }
    setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading Admin...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <LoginPage onLogin={fetchData} />;
  }

  if (!data) return null;

  return <Dashboard data={data} onRefresh={fetchData} onLogout={handleLogout} />;
}
