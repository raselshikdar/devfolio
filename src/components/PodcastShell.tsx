"use client";

import dynamic from "next/dynamic";

// Dynamically import podcast components to avoid SSR issues
const PodcastProvider = dynamic(
  () => import("@/lib/PodcastContext").then((m) => ({ default: m.PodcastProvider })),
  { ssr: false }
);
const PodcastPlayer = dynamic(
  () => import("@/components/PodcastPlayer"),
  { ssr: false }
);

export default function PodcastShell({ children }: { children: React.ReactNode }) {
  return (
    <PodcastProvider>
      {children}
      <PodcastPlayer />
    </PodcastProvider>
  );
}
