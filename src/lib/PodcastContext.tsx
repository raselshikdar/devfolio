"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

interface PodcastState {
  isLive: boolean;
  isPlaying: boolean;
  title: string | null;
  streamUrl: string | null;
  status: string;
  description: string | null;
}

interface PodcastContextType extends PodcastState {
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  setPodcastData: (data: Partial<PodcastState>) => void;
}

const PodcastContext = createContext<PodcastContextType | null>(null);

export function usePodcast() {
  const ctx = useContext(PodcastContext);
  if (!ctx)
    throw new Error("usePodcast must be used within PodcastProvider");
  return ctx;
}

export function PodcastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PodcastState>({
    isLive: false,
    isPlaying: false,
    title: null,
    streamUrl: null,
    status: "offline",
    description: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create a single persistent audio element
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.preload = "none";
    }

    const audio = audioRef.current;

    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onError = () => {
      console.warn("[PodcastPlayer] Audio error");
      setState((s) => ({ ...s, isPlaying: false }));
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  // Poll for podcast status every 8 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/podcast");
        if (!res.ok) return;
        const data = await res.json();
        const wasLive = state.isLive;
        const newIsLive = !!data.isLive;

        setState((s) => ({
          ...s,
          isLive: newIsLive,
          title: data.title,
          streamUrl: data.streamUrl,
          status: data.status || "offline",
          description: data.description,
        }));

        // If stream just went offline, stop playing
        if (wasLive && !newIsLive && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }

        // If stream URL changed while playing, update source
        if (
          newIsLive &&
          audioRef.current &&
          !audioRef.current.paused &&
          data.streamUrl !== audioRef.current.src
        ) {
          audioRef.current.src = data.streamUrl || "";
          audioRef.current.play().catch(() => {});
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    // Initial poll
    poll();

    // Poll every 8 seconds
    pollIntervalRef.current = setInterval(poll, 8000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    if (!audioRef.current) return;
    if (!state.isLive || !state.streamUrl) return;
    if (audioRef.current.src !== state.streamUrl) {
      audioRef.current.src = state.streamUrl;
    }
    audioRef.current.play().catch(() => {});
  }, [state.isLive, state.streamUrl]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setPodcastData = useCallback((data: Partial<PodcastState>) => {
    setState((s) => ({ ...s, ...data }));
  }, []);

  return (
    <PodcastContext.Provider
      value={{
        ...state,
        togglePlay,
        play,
        pause,
        setPodcastData,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
}
