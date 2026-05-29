import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects — modern, scalable applications built with Next.js, React, TypeScript, and more.",
  openGraph: {
    title: "Projects — Rasel Shikdar",
    description:
      "Explore my portfolio of web development projects — modern, scalable applications built with Next.js, React, TypeScript, and more.",
    url: "https://raselsh.pro.bd/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Rasel Shikdar",
    description:
      "Explore my portfolio of web development projects — modern, scalable applications built with Next.js, React, TypeScript, and more.",
  },
  alternates: { canonical: "https://raselsh.pro.bd/projects" },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
