import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles and insights on web development, Next.js, React, TypeScript, and modern software engineering practices.",
  openGraph: {
    title: "Blog — Rasel Shikdar",
    description:
      "Technical articles and insights on web development, Next.js, React, TypeScript, and modern software engineering practices.",
    url: "https://raselsh.pro.bd/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Rasel Shikdar",
    description:
      "Technical articles and insights on web development, Next.js, React, TypeScript, and modern software engineering practices.",
  },
  alternates: { canonical: "https://raselsh.pro.bd/blog" },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
