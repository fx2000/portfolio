"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useSiteEffects } from "@/context/SiteEffectsContext";
import { parseCommandFromResponse, executeCommand } from "@/lib/commandRegistry";
import CodeSandbox from "@/components/CodeSandbox";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <p className="px-3.5 py-2.5 text-sm text-[#888888]">…</p>,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hey! I'm AI-Daniel 👋 Ask me about Daniel's work, or try something fun — say \"show me your AI work\" and I'll take you there, or try \"throw confetti\" and \"make it snow\"! I can even change the site's colors.",
};

/** Maximum number of messages kept in the conversation context sent to the API */
const MAX_CONTEXT_MESSAGES = 20;

/** Strip markdown and command tags from text for cleaner TTS */
function stripForSpeech(text: string): string {
  return text
    .replace(/\[COMMAND:\s*\{[^}]+\}\s*\]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Close (X) icon SVG */
function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Send arrow icon SVG */
function IconSend() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/** Microphone icon SVG */
function IconMic() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="22" x2="12" y2="17" />
    </svg>
  );
}

/** Small speaker icon for TTS indicator */
function IconSpeaker() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/** Download icon SVG */
function IconDownload() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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
          style={{ animation: `chat-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

/**
 * Floating chat widget with text and voice input.
 * Voice uses Web Speech API (SpeechRecognition for STT, SpeechSynthesis for TTS).
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(true);

  // Voice state
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceModeRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  // Pitch CTA state — tracks which message indices should show the download button
  const [pitchMessageIndices, setPitchMessageIndices] = useState<Set<number>>(new Set());
  // Code sandbox state — tracks code blocks per message index
  const [codeBlocks, setCodeBlocks] = useState<Map<number, { code: string; language: string }>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  const { setEffects, resetEffects } = useSiteEffects();

  useFocusTrap(chatPanelRef, isOpen);

  // --- Speech Recognition setup ---
  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionCtor) return;

    setVoiceSupported(true);
    recognitionRef.current = new SpeechRecognitionCtor();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    (recognitionRef.current as unknown as Record<string, unknown>).maxAlternatives = 1;
  }, []);

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
    const handleScroll = () => setShowBubble(window.scrollY <= 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  /** Speak text using Google Cloud TTS via /api/tts */
  const speakResponse = useCallback(async (text: string) => {
    // Stop any currently playing audio
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }

    const cleaned = stripForSpeech(text);
    if (!cleaned) return;

    try {
      setIsSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleaned }),
      });

      if (!res.ok) {
        setIsSpeaking(false);
        return;
      }

      const data = await res.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      ttsAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        ttsAudioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        ttsAudioRef.current = null;
      };

      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  /** Send a message and fetch the AI reply */
  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    const shouldSpeak = voiceModeRef.current;
    voiceModeRef.current = false;

    const contextMessages = updatedMessages.slice(-MAX_CONTEXT_MESSAGES);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: contextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      let { text: replyText, command } = parseCommandFromResponse(data.reply);

      // Auto-detect code blocks even if the AI forgot the showCode command.
      // Matches ``` with optional language, newline or space, then code, then closing ```.
      // Also detects multi-line code without fences (4+ lines starting with spaces/function/const/let/var/if/for).
      if (!command || command.action !== "showCode") {
        // Also match <code>...</code> blocks
        const htmlCodeMatch = replyText.match(/<code(?:\s+class="[^"]*language-(\w+)"[^>]*)?\s*>([\s\S]*?)<\/code>/);
        if (htmlCodeMatch) {
          command = { action: "showCode", code: htmlCodeMatch[2].trim(), language: htmlCodeMatch[1] || "javascript" };
          replyText = replyText.replace(/<code(?:\s[^>]*)?>[\s\S]*?<\/code>/g, "").replace(/<pre[^>]*>\s*<\/pre>/g, "").trim();
        }

        if (!command) {
          const fencedMatch = replyText.match(/```(\w*)\s*\n([\s\S]*?)```/);
          if (fencedMatch) {
            command = { action: "showCode", code: fencedMatch[2].trim(), language: fencedMatch[1] || "javascript" };
            replyText = replyText.replace(/```\w*\s*\n[\s\S]*?```/g, "").trim();
          }
        }

        if (!command) {
          // Detect unfenced code: 4+ consecutive lines that look like code
          const lines = replyText.split("\n");
          const codePattern = /^(\s{2,}|\t)?(function |const |let |var |if |for |while |return |class |import |export |\/\/|\{|\}|=>)/;
          let codeStart = -1;
          let codeEnd = -1;
          let consecutive = 0;

          for (let li = 0; li < lines.length; li++) {
            if (codePattern.test(lines[li])) {
              if (codeStart === -1) codeStart = li;
              codeEnd = li;
              consecutive++;
            } else if (lines[li].trim() === "") {
              // blank lines inside code are OK
              if (consecutive > 0) codeEnd = li;
            } else {
              if (consecutive >= 4) break;
              codeStart = -1;
              codeEnd = -1;
              consecutive = 0;
            }
          }

          if (consecutive >= 4 && codeStart !== -1) {
            const codeLines = lines.slice(codeStart, codeEnd + 1);
            const textLines = [...lines.slice(0, codeStart), ...lines.slice(codeEnd + 1)];
            command = { action: "showCode", code: codeLines.join("\n").trim(), language: "javascript" };
            replyText = textLines.join("\n").trim();
          }
        }
      }

      const assistantMsg: Message = { role: "assistant", content: replyText };
      const isCodeResponse = command?.action === "showCode" && command.code;

      // Calculate the index the new message will have
      const newIdx = messages.length + 1; // +1 because user message was already added

      setMessages((prev) => [...prev, assistantMsg]);

      if (command?.action === "generatePitch") {
        setPitchMessageIndices((s) => new Set(s).add(newIdx));
      }
      if (isCodeResponse) {
        setCodeBlocks((m) => new Map(m).set(newIdx, { code: command!.code!, language: command!.language || "javascript" }));
      }

      if (command) {
        executeCommand(command, setEffects, resetEffects);
      }

      // Speak response in voice mode, but skip for code responses
      if (shouldSpeak && !isCodeResponse) {
        speakResponse(replyText);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, messages, setEffects, resetEffects, speakResponse]);

  /** Toggle voice input on/off */
  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    // Stop any ongoing TTS
    if (isSpeaking && ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
      setIsSpeaking(false);
    }

    finalTranscriptRef.current = "";
    setInput("");
    setError(null);

    // Debounce timer — waits for a pause in speech before sending
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    const SILENCE_TIMEOUT = 2000; // 2 seconds of silence before auto-sending

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Clear any pending silence timer since we got new speech
      if (silenceTimer) clearTimeout(silenceTimer);

      let allFinal = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          allFinal += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // Accumulate all final results (handles multi-phrase speech)
      if (allFinal.trim()) {
        finalTranscriptRef.current = allFinal.trim();
      }

      // Show combined transcript in input
      setInput((allFinal + interim).trim());

      // If we got a final result, start the silence timer
      // If user keeps speaking, onresult fires again and resets the timer
      if (allFinal.trim()) {
        silenceTimer = setTimeout(() => {
          recognition.stop();
        }, SILENCE_TIMEOUT);
      }
    };

    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
      const transcript = finalTranscriptRef.current.trim();
      if (transcript) {
        voiceModeRef.current = true;
        sendMessage(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone permissions.");
      }
    };

    recognition.start();
    setIsListening(true);
  }, [isListening, isSpeaking, sendMessage]);

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

  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <>
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
          width: calc(100vw - 1rem);
        }
        @media (min-width: 640px) {
          .chat-panel-enter {
            max-height: min(520px, calc(100dvh - 304px));
            height: auto;
          }
          .chat-panel-normal {
            width: 380px;
            transition: width 0.3s ease;
          }
          .chat-panel-wide {
            width: 50vw;
            max-height: min(700px, calc(100dvh - 304px));
            transition: width 0.3s ease;
          }
        }
        @keyframes mic-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .mic-listening {
          animation: mic-pulse 1.2s ease-in-out infinite;
          background: #ef4444 !important;
        }
        @keyframes tts-wave {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .tts-indicator {
          animation: tts-wave 1s ease-in-out infinite;
        }
        @keyframes pitch-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(229, 84, 10, 0.3); }
          50% { box-shadow: 0 0 16px rgba(229, 84, 10, 0.6); }
        }
        .pitch-cta {
          animation: pitch-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className={`chat-panel-enter fixed bottom-[160px] sm:bottom-[288px] right-2 sm:right-4 flex flex-col rounded-2xl overflow-hidden border border-[#1a1a1a] shadow-2xl ${
            codeBlocks.size > 0 ? "chat-panel-wide" : "chat-panel-normal"
          }`}
          style={{ zIndex: 10001, background: "#0a0a0a" }}
          role="dialog"
          aria-label="Chat with Daniel's portfolio assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#e5540a] shrink-0" style={{ boxShadow: "0 0 6px #e5540a" }} />
              <div>
                <p className="text-sm font-medium text-[#f5f5f5] leading-none">AI-Daniel is here to help you</p>
                <p className="text-[10px] text-[#888888] mt-0.5">Powered by Gemini 2.5 Flash</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-[#888888] hover:text-[#f5f5f5] hover:bg-[#141414] transition-colors" aria-label="Close chat">
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#e5540a] text-white rounded-br-sm whitespace-pre-wrap"
                      : "bg-[#141414] text-[#f5f5f5] rounded-bl-sm border border-[#1a1a1a] chat-markdown"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <>
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#ff8c42] underline underline-offset-2 hover:text-[#ffae70] transition-colors">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {isSpeaking && i === lastAssistantIdx && (
                        <span className="tts-indicator inline-flex items-center gap-1 mt-1.5 text-[#e5540a] text-[10px]">
                          <IconSpeaker />
                          Speaking...
                        </span>
                      )}
                      {pitchMessageIndices.has(i) && (
                        <a
                          href="/files/DanielDuqueCV.pdf"
                          download="DanielDuqueCV.pdf"
                          className="pitch-cta flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-[#e5540a] text-white text-sm font-medium no-underline hover:bg-[#ff6b1a] transition-colors"
                        >
                          <IconDownload />
                          Download Daniel&apos;s Resume
                        </a>
                      )}
                      {codeBlocks.has(i) && (
                        <CodeSandbox
                          initialCode={codeBlocks.get(i)!.code}
                          language={codeBlocks.get(i)!.language}
                        />
                      )}
                    </>
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
                placeholder={isListening ? "Listening..." : "Ask me anything..."}
                aria-label="Type your message"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder-[#808080] resize-none outline-none leading-relaxed min-h-[24px]"
                style={{ maxHeight: "120px" }}
                disabled={isLoading}
                readOnly={isListening}
              />
              {voiceSupported && (
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                    isListening
                      ? "mic-listening text-white"
                      : "bg-[#1a1a1a] text-[#888888] hover:text-[#f5f5f5] hover:bg-[#333333]"
                  } disabled:opacity-30 disabled:cursor-not-allowed`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  <IconMic />
                </button>
              )}
              <button
                onClick={() => sendMessage()}
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
        <div className="speech-bubble-enter fixed bottom-[160px] sm:bottom-[288px] right-[16px] sm:right-[120px]" style={{ zIndex: 10000 }}>
          <div className="relative bg-white rounded-3xl px-4 py-3 sm:px-8 sm:py-6 shadow-xl max-w-[240px] sm:max-w-[420px]">
            <p className="text-sm sm:text-xl font-bold text-[#1a1a1a] leading-snug">
              I&apos;m AI-Daniel — ask me anything or try &quot;throw confetti&quot;!
            </p>
            <div
              className="absolute -bottom-3 right-6 sm:right-10 w-0 h-0"
              style={{ borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "12px solid white" }}
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
        <Image src="/images/avatar.webp" alt="AI-Daniel" width={256} height={256} priority className="w-full h-full object-cover" />
      </button>
    </>
  );
}
