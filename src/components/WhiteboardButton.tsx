"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const WhiteboardOverlay = dynamic(() => import("@/components/WhiteboardOverlay"), { ssr: false });

const COLORS = [
  "#e5540a", "#3b82f6", "#22c55e", "#a855f7",
  "#ec4899", "#f59e0b", "#06b6d4", "#ef4444",
  "#8b5cf6", "#14b8a6", "#f97316", "#6366f1",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function WhiteboardButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [myColor] = useState(getRandomColor);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Track presence for user count
  useEffect(() => {
    const ch = supabase.channel("whiteboard", {
      config: { presence: { key: crypto.randomUUID() } },
    });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const count = Object.keys(state).length;
      setOnlineCount(count);
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ color: myColor, joinedAt: Date.now() });
      }
    });

    setChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, [myColor]);

  // Shrink on scroll (mirror chat avatar behavior)
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY <= 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <style>{`
        @keyframes wb-badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>

      {/* Whiteboard trigger button */}
      <button
        onClick={handleOpen}
        className="fixed left-6 sm:left-10 flex flex-col items-center gap-0 group"
        style={{
          zIndex: 10000,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s ease",
          transformOrigin: "top left",
          top: showButton ? "64px" : "16px",
          transform: showButton
            ? "rotate(-25deg) scale(1)"
            : "rotate(0deg) scale(0.5)",
        }}
        aria-label="Open collaborative whiteboard"
      >
        {/* Icon — 50% of chatbot avatar */}
        <div className="relative w-16 h-16 sm:w-32 sm:h-32">
          <Image
            src="/images/whiteboard.png"
            alt="Collaborative whiteboard"
            width={128}
            height={128}
            className="w-full h-full object-contain drop-shadow-lg hover:brightness-110"
          />

          {/* Online count — centered on the whiteboard */}
          {onlineCount > 0 && (
            <span
              className="absolute inset-0 flex items-center justify-center text-lg sm:text-3xl font-bold text-[#e5540a] drop-shadow-md"
              style={{ animation: "wb-badge-pulse 2s ease-in-out infinite" }}
            >
              {onlineCount}
            </span>
          )}
        </div>

        {/* Label — hidden when scrolled */}
        <span
          className="-mt-3 sm:-mt-5 text-xs sm:text-lg text-muted font-bold tracking-wide group-hover:text-foreground"
          style={{
            transition: "opacity 0.3s ease, max-height 0.3s ease",
            opacity: showButton ? 1 : 0,
            maxHeight: showButton ? "20px" : "0px",
            overflow: "hidden",
          }}
        >
          Collaborate!
        </span>
      </button>

      {/* Whiteboard overlay */}
      {isOpen && channel && (
        <WhiteboardOverlay
          channel={channel}
          myColor={myColor}
          onlineCount={onlineCount}
          onClose={handleClose}
        />
      )}
    </>
  );
}
