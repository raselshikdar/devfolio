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
  title: "Rasel Shikdar — Full-Stack Developer",
  description:
    "Personal portfolio of Rasel Shikdar — Full-Stack Developer specializing in modern web technologies, scalable applications, and clean UI/UX.",
  keywords: [
    "portfolio",
    "developer",
    "full-stack",
    "Rasel Shikdar",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Rasel Shikdar" }],
  icons: {
    icon: "/logo.svg",
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
