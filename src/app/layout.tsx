import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import PodcastShell from "@/components/PodcastShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raselsh.pro.bd"),
  title: {
    default: "Rasel Shikdar — Full-Stack Developer",
    template: "%s | Rasel Shikdar",
  },
  description:
    "Full-Stack Developer building modern, scalable, and high-performance web applications with clean UI/UX and smooth user experiences. 5+ years of experience, 50+ projects completed.",
  keywords: [
    "Rasel Shikdar",
    "Full-Stack Developer",
    "Web Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Rasel Shikdar", url: "https://raselsh.pro.bd" }],
  creator: "Rasel Shikdar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://raselsh.pro.bd",
    siteName: "Rasel Shikdar",
    title: "Rasel Shikdar — Full-Stack Developer",
    description:
      "Full-Stack Developer building modern, scalable, and high-performance web applications with clean UI/UX and smooth user experiences.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rasel Shikdar — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasel Shikdar — Full-Stack Developer",
    description:
      "Full-Stack Developer building modern, scalable, and high-performance web applications.",
    images: ["/og-image.png"],
    creator: "@raselshikdar_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://raselsh.pro.bd",
  },
  icons: {
    icon: ["/favicon.png", "/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PodcastShell>
            {children}
          </PodcastShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
