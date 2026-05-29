import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Digital products and resources for developers — UI kits, templates, handbooks, and design systems to accelerate your workflow.",
  openGraph: {
    title: "Store — Rasel Shikdar",
    description:
      "Digital products and resources for developers — UI kits, templates, handbooks, and design systems to accelerate your workflow.",
    url: "https://raselsh.pro.bd/store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store — Rasel Shikdar",
    description:
      "Digital products and resources for developers — UI kits, templates, handbooks, and design systems to accelerate your workflow.",
  },
  alternates: { canonical: "https://raselsh.pro.bd/store" },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
