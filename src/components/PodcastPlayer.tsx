"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcast } from "@/lib/PodcastContext";

/* ─── Equalizer bars animation ─── */
function EqualizerBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-emerald"
          animate={
            playing
              ? {
                  height: ["4px", "14px", "6px", "16px", "8px"],
                }
              : { height: "4px" }
          }
          transition={
            playing
              ? {
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

/* ─── Live badge pulse ─── */
function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
        LIVE
      </span>
    </div>
  );
}

/* ─── Floating Podcast Player ─── */
export default function PodcastPlayer() {
  const { isLive, isPlaying, title, togglePlay } = usePodcast();
  const [minimized, setMinimized] = useState(false);

  // Auto-minimize after 5 seconds of playing
  useEffect(() => {
    if (isPlaying && !minimized) {
      const t = setTimeout(() => setMinimized(true), 5000);
      return () => clearTimeout(t);
    }
  }, [isPlaying, minimized]);

  if (!isLive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150]"
      >
        {minimized ? (
          /* Mini pill player */
          <motion.button
            layout
            onClick={() => setMinimized(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-card/95 backdrop-blur-md border border-emerald/30 shadow-lg shadow-emerald/5 hover:border-emerald/60 transition-colors"
            title="Expand podcast player"
          >
            <EqualizerBars playing={isPlaying} />
            <span className="text-xs font-medium text-foreground max-w-[140px] truncate">
              {title || "Live Podcast"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-emerald flex items-center justify-center text-white hover:bg-emerald/80 transition-colors shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <rect x="1" y="0" width="3" height="10" rx="1" />
                  <rect x="6" y="0" width="3" height="10" rx="1" />
                </svg>
              ) : (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <polygon points="1,0 9,5 1,10" />
                </svg>
              )}
            </button>
          </motion.button>
        ) : (
          /* Expanded player bar */
          <motion.div
            layout
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-md border border-emerald/30 shadow-lg shadow-emerald/5 min-w-[280px] max-w-[400px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <LiveBadge />
              </div>
              <p className="text-sm font-semibold text-foreground truncate">
                {title || "Live Podcast"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <EqualizerBars playing={isPlaying} />
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-emerald flex items-center justify-center text-white hover:bg-emerald/80 transition-colors shadow-md"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <rect x="2" y="0" width="4" height="14" rx="1" />
                    <rect x="8" y="0" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <polygon points="2,0 14,7 2,14" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMinimized(true)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald transition-colors"
                aria-label="Minimize player"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <polyline points="2,4 5,7 8,4" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
