"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hey! I'm here to answer any questions about Daniel's experience, projects, or skills. What would you like to know?",
};

/** Maximum number of messages kept in the conversation context sent to the API */
const MAX_CONTEXT_MESSAGES = 20;

/** Chat icon SVG */
function IconChat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      `}</style>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="chat-panel-enter fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] flex flex-col rounded-2xl overflow-hidden border border-[#1a1a1a] shadow-2xl"
          style={{
            zIndex: 10001,
            background: "#0a0a0a",
            maxHeight: "min(520px, calc(100dvh - 120px))",
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
                  Ask about Daniel
                </p>
                <p className="text-[10px] text-[#888888] mt-0.5">
                  Powered by Gemini 2.0 Flash
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
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#e5540a] text-white rounded-br-sm"
                      : "bg-[#141414] text-[#f5f5f5] rounded-bl-sm border border-[#1a1a1a]"
                  }`}
                >
                  {msg.content}
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
                placeholder="Ask anything about Daniel…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder-[#555555] resize-none outline-none leading-relaxed min-h-[24px]"
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
            <p className="text-[10px] text-[#555555] text-center mt-1.5">
              Free tier · 1,500 req/day · 15 req/min
            </p>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          zIndex: 10000,
          background: "linear-gradient(135deg, #e5540a 0%, #ff6b1a 100%)",
          boxShadow: "0 4px 24px rgba(229, 84, 10, 0.4)",
        }}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        aria-expanded={isOpen}
      >
        <span
          className="transition-all duration-300"
          style={{
            opacity: 1,
            transform: isOpen ? "rotate(90deg) scale(0.85)" : "rotate(0deg) scale(1)",
          }}
        >
          {isOpen ? <IconClose /> : <IconChat />}
        </span>
      </button>
    </>
  );
}
