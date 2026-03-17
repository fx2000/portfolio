"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  type: string;
  title: string;
}

/**
 * Custom styled audio player that replaces the browser's native controls
 * with a design-system-consistent UI.
 */
export default function AudioPlayer({ src, type, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /** Formats seconds into m:ss display. */
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /** Toggles play / pause on the underlying audio element. */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  /** Seeks audio to a position based on a click/drag on the progress bar. */
  const seekTo = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;

      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = ratio * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      seekTo(e.clientX);
    },
    [seekTo]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => seekTo(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, seekTo]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      seekTo(e.touches[0].clientX);
      setIsDragging(true);
    },
    [seekTo]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => seekTo(e.touches[0].clientX);
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, seekTo]);

  return (
    <div className="pt-2">
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!isDragging) setCurrentTime(e.currentTarget.duration ? e.currentTarget.currentTime : 0);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      >
        <source src={src} type={type} />
      </audio>

      <div className="flex items-center gap-3 rounded-xl bg-surface-light border border-white/[0.06] px-4 py-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="relative flex-shrink-0 w-9 h-9 rounded-full bg-accent hover:bg-accent-light transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2.5" y="1.5" width="3" height="11" rx="1" fill="white" />
              <rect x="8.5" y="1.5" width="3" height="11" rx="1" fill="white" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 1.8C3.5 1.3 4.05 1 4.47 1.26L12.13 6.46C12.53 6.71 12.53 7.29 12.13 7.54L4.47 12.74C4.05 13 3.5 12.7 3.5 12.2V1.8Z"
                fill="white"
              />
            </svg>
          )}
        </button>

        {/* Track info + progress */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/70 truncate mb-1.5">{title}</p>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="group relative w-full h-1.5 bg-white/[0.06] rounded-full cursor-pointer"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={0}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              if (!audio) return;
              const step = 5;
              if (e.key === "ArrowRight") {
                audio.currentTime = Math.min(duration, currentTime + step);
              } else if (e.key === "ArrowLeft") {
                audio.currentTime = Math.max(0, currentTime - step);
              }
            }}
          >
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 bg-accent rounded-full transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />

            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md shadow-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
            />
          </div>

          {/* Times */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] tabular-nums text-muted">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] tabular-nums text-muted">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
