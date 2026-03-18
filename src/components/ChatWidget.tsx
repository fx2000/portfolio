"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hey! I'm AI-Daniel — I'm not as good as the real Daniel, but I can help you with any questions you might have about him.",
};

/** Maximum number of messages kept in the conversation context sent to the API */
const MAX_CONTEXT_MESSAGES = 20;

/** Close (X) icon SVG */
function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Send arrow icon SVG */
function IconSend() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/** Animated three-dot typing indicator */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#888888] inline-block"
          style={{
            animation: `chat-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Floating chat widget that opens a conversation panel powered by the
 * Gemini 2.0 Flash API via a Netlify edge function at /api/chat.
 *
 * The widget sits in the bottom-right corner above all other overlays.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(chatPanelRef, isOpen);

  /** Scroll the messages list to the bottom */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /** Show the speech bubble only when the page is scrolled to the top */
  useEffect(() => {
    const handleScroll = () => {
      setShowBubble(window.scrollY <= 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  /** Send the current input as a user message and fetch the assistant reply */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    // Keep only the most recent N messages for the API context to stay
    // within token limits and avoid unnecessary costs
    const contextMessages = updatedMessages.slice(-MAX_CONTEXT_MESSAGES);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: contextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ??
            "Something went wrong. Please try again."
        );
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Handle Enter to send (Shift+Enter for newline) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /** Auto-grow the textarea up to a max height */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <>
      {/* Keyframe for the typing dot bounce animation */}
      <style>{`
        @keyframes chat-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chat-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .chat-panel-enter {
          animation: chat-panel-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .chat-markdown p { margin: 0; }
        .chat-markdown p + p { margin-top: 0.5rem; }
        .chat-markdown ul, .chat-markdown ol { margin: 0.35rem 0; padding-left: 1.25rem; }
        .chat-markdown li { margin: 0.15rem 0; }
        .chat-markdown code { background: #1e1e1e; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
        .chat-markdown strong { font-weight: 600; }
        @keyframes speech-bubble-pop {
          0%   { opacity: 0; transform: scale(0.3) translateY(16px); }
          40%  { opacity: 1; transform: scale(1.12) translateY(-6px); }
          60%  { transform: scale(0.95) translateY(2px); }
          80%  { transform: scale(1.04) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .speech-bubble-enter {
          animation: speech-bubble-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .chat-panel-enter {
          max-height: calc(100dvh - 176px);
          height: 100dvh;
        }
        @media (min-width: 640px) {
          .chat-panel-enter {
            max-height: min(520px, calc(100dvh - 304px));
            height: auto;
          }
        }
      `}</style>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className="chat-panel-enter fixed bottom-[160px] sm:bottom-[288px] right-2 sm:right-4 w-[calc(100vw-1rem)] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden border border-[#1a1a1a] shadow-2xl"
          style={{
            zIndex: 10001,
            background: "#0a0a0a",
          }}
          role="dialog"
          aria-label="Chat with Daniel's portfolio assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] shrink-0">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full bg-[#e5540a] shrink-0"
                style={{ boxShadow: "0 0 6px #e5540a" }}
              />
              <div>
                <p className="text-sm font-medium text-[#f5f5f5] leading-none">
                  AI-Daniel is here to help you
                </p>
                <p className="text-[10px] text-[#888888] mt-0.5">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#888888] hover:text-[#f5f5f5] hover:bg-[#141414] transition-colors"
              aria-label="Close chat"
            >
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#e5540a] text-white rounded-br-sm whitespace-pre-wrap"
                      : "bg-[#141414] text-[#f5f5f5] rounded-bl-sm border border-[#1a1a1a] chat-markdown"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ff8c42] underline underline-offset-2 hover:text-[#ffae70] transition-colors"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#141414] border border-[#1a1a1a] rounded-2xl rounded-bl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-[#1a0a0a] border border-[#e5540a]/30 text-[#ff6b6b]">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-[#1a1a1a] shrink-0">
            <div className="flex items-end gap-2 bg-[#141414] rounded-xl border border-[#1a1a1a] px-3 py-2 focus-within:border-[#333333] transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                aria-label="Type your message"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder-[#808080] resize-none outline-none leading-relaxed min-h-[24px]"
                style={{ maxHeight: "120px" }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#e5540a] text-white transition-all hover:bg-[#ff6b1a] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <IconSend />
              </button>
            </div>
            <p className="text-[10px] text-[#888888] text-center mt-1.5">
              Free tier · 1,500 req/day · 15 req/min
            </p>
          </div>
        </div>
      )}

      {/* Speech bubble */}
      {showBubble && !isOpen && (
        <div
          className="speech-bubble-enter fixed bottom-[160px] sm:bottom-[288px] right-[16px] sm:right-[120px]"
          style={{ zIndex: 10000 }}
        >
          <div
            className="relative bg-white rounded-3xl px-4 py-3 sm:px-8 sm:py-6 shadow-xl max-w-[240px] sm:max-w-[420px]"
          >
            <p className="text-sm sm:text-xl font-bold text-[#1a1a1a] leading-snug">
              I&apos;m AI-Daniel, ask me anything!
            </p>
            {/* Comic-style tail pointing down toward the avatar */}
            <div
              className="absolute -bottom-3 right-6 sm:right-10 w-0 h-0"
              style={{
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "12px solid white",
              }}
            />
          </div>
        </div>
      )}

      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-4 right-2 sm:right-4 w-32 h-32 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-lg hover:brightness-110 active:scale-95"
        style={{
          zIndex: 10000,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "bottom right",
          transform: showBubble || isOpen ? "scale(1)" : "scale(0.5)",
        }}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        aria-expanded={isOpen}
      >
        <Image
          src="/images/avatar.png"
          alt="AI-Daniel"
          width={256}
          height={256}
          className="w-full h-full object-cover"
        />
      </button>
    </>
  );
}
