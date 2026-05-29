"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePodcast } from "@/lib/PodcastContext";

/* ─── Pulsing streaming rings around the hero avatar ─── */
function StreamingRings() {
  return (
    <>
      {/* Outermost ring - slow pulse */}
      <motion.div
        className="absolute inset-[-8px] rounded-full border-2 border-emerald/20"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Middle ring - medium pulse */}
      <motion.div
        className="absolute inset-[-5px] rounded-full border-2 border-emerald/30"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      {/* Inner ring - fast pulse */}
      <motion.div
        className="absolute inset-[-2px] rounded-full border border-emerald/40"
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
      {/* Glow effect */}
      <motion.div
        className="absolute inset-[-4px] rounded-full"
        animate={{
          boxShadow: [
            "0 0 8px 2px rgba(16,185,129,0.15)",
            "0 0 20px 6px rgba(16,185,129,0.3)",
            "0 0 8px 2px rgba(16,185,129,0.15)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

/* ─── Small equalizer bars for the avatar badge ─── */
function MiniEqualizer() {
  return (
    <div className="flex items-end gap-[1.5px] h-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-white"
          animate={{
            height: ["3px", "10px", "5px", "12px", "4px"],
          }}
          transition={{
            duration: 0.6 + i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Live indicator badge on avatar ─── */
function LiveIndicator() {
  return (
    <div className="absolute -top-1 -right-1 z-10">
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500 shadow-md">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        <span className="text-[7px] font-bold text-white uppercase tracking-wider leading-none">
          LIVE
        </span>
      </div>
    </div>
  );
}

/* ─── Play/Pause button on avatar ─── */
function AvatarPlayButton() {
  const { isPlaying, togglePlay } = usePodcast();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
      onClick={togglePlay}
      className="absolute -bottom-1 -right-1 z-10 w-8 h-8 rounded-full bg-emerald flex items-center justify-center text-white shadow-lg hover:bg-emerald/80 transition-colors border-2 border-background"
      aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
    >
      {isPlaying ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <rect x="1" y="0" width="3" height="10" rx="0.5" />
          <rect x="6" y="0" width="3" height="10" rx="0.5" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <polygon points="1,0 10,5 1,10" />
        </svg>
      )}
    </motion.button>
  );
}

/* ─── Main wrapper: applies streaming ring + controls when live ─── */
export default function LivePodcastRing({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLive, isPlaying } = usePodcast();

  if (!isLive) return <>{children}</>;

  return (
    <div className="relative">
      {/* Streaming rings */}
      <StreamingRings />

      {/* The avatar (children) */}
      {children}

      {/* Live badge */}
      <LiveIndicator />

      {/* Play/pause button */}
      <AvatarPlayButton />

      {/* Mini equalizer overlay when playing */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-1 left-1 z-10 px-1 py-0.5 rounded-full bg-black/50 backdrop-blur-sm"
        >
          <MiniEqualizer />
        </motion.div>
      )}
    </div>
  );
}
