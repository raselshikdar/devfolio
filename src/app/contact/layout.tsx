import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rasel Shikdar — available for freelance projects, collaborations, and consulting opportunities.",
  openGraph: {
    title: "Contact — Rasel Shikdar",
    description:
      "Get in touch with Rasel Shikdar — available for freelance projects, collaborations, and consulting opportunities.",
    url: "https://raselsh.pro.bd/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Rasel Shikdar",
    description:
      "Get in touch with Rasel Shikdar — available for freelance projects, collaborations, and consulting opportunities.",
  },
  alternates: { canonical: "https://raselsh.pro.bd/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
