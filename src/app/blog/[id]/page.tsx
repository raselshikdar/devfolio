"use client";
import dynamic from "next/dynamic";

const BlogDetailClient = dynamic(() => import("./BlogDetailClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading Article...</p>
      </div>
    </div>
  ),
});

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
