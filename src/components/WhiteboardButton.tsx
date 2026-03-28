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
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [myName, setMyName] = useState("");
  const [nameInput, setNameInput] = useState("");
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

  const handleOpen = useCallback(() => {
    if (!myName) {
      setShowNamePrompt(true);
      return;
    }
    setIsOpen(true);
  }, [myName]);

  const handleNameSubmit = useCallback(() => {
    const trimmed = nameInput.trim().slice(0, 12);
    if (!trimmed) return;
    setMyName(trimmed);
    setShowNamePrompt(false);
    setIsOpen(true);
    // Update presence with name
    channel?.track({ color: myColor, name: trimmed, joinedAt: Date.now() });
  }, [nameInput, channel, myColor]);

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

      {/* Name prompt */}
      {showNamePrompt && (
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 10002, background: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowNamePrompt(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 flex flex-col items-center gap-4 p-6 rounded-2xl border border-[#333]"
            style={{
              zIndex: 10003,
              transform: "translate(-50%, -50%)",
              background: "#0a0a0a",
              boxShadow: "0 0 40px rgba(229, 84, 10, 0.2)",
              minWidth: 280,
            }}
          >
            <p className="text-sm text-[#f5f5f5] font-medium">Enter your name to collaborate</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value.slice(0, 12))}
              onKeyDown={(e) => { if (e.key === "Enter") handleNameSubmit(); }}
              placeholder="Your name (max 12 chars)"
              maxLength={12}
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#333] text-sm text-[#f5f5f5] placeholder-[#666] outline-none focus:border-[#e5540a] transition-colors"
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowNamePrompt(false)}
                className="flex-1 px-3 py-2 text-xs font-mono text-[#888] hover:text-white bg-[#1a1a1a] hover:bg-[#333] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="flex-1 px-3 py-2 text-xs font-mono text-white bg-[#e5540a] hover:bg-[#ff6b1a] rounded-lg transition-colors disabled:opacity-30"
              >
                Join
              </button>
            </div>
          </div>
        </>
      )}

      {/* Whiteboard overlay */}
      {isOpen && channel && (
        <WhiteboardOverlay
          channel={channel}
          myColor={myColor}
          myName={myName}
          onlineCount={onlineCount}
          onClose={handleClose}
        />
      )}
    </>
  );
}
