import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated collection of images, notes, and quotes — visual inspiration and thoughts from my journey as a developer.",
  openGraph: {
    title: "Gallery — Rasel Shikdar",
    description:
      "A curated collection of images, notes, and quotes — visual inspiration and thoughts from my journey as a developer.",
    url: "https://raselsh.pro.bd/gallery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Rasel Shikdar",
    description:
      "A curated collection of images, notes, and quotes — visual inspiration and thoughts from my journey as a developer.",
  },
  alternates: { canonical: "https://raselsh.pro.bd/gallery" },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
