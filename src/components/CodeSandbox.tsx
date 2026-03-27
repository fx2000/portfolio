"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CodeSandboxProps {
  initialCode: string;
  language: string;
}

export default function CodeSandbox({ initialCode, language }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<Array<{ type: "log" | "error"; text: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for messages from the sandboxed iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "sandbox-log") {
        setOutput((prev) => [...prev, { type: "log", text: e.data.text }]);
      } else if (e.data?.type === "sandbox-error") {
        setOutput((prev) => [...prev, { type: "error", text: e.data.text }]);
      } else if (e.data?.type === "sandbox-done") {
        setIsRunning(false);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const runCode = useCallback(() => {
    setOutput([]);
    setIsRunning(true);

    // Remove old iframe if any
    if (iframeRef.current) {
      iframeRef.current.remove();
      iframeRef.current = null;
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const html = `<!DOCTYPE html><html><body><script>
      // Override console.log to post messages to parent
      const _log = console.log;
      console.log = (...args) => {
        parent.postMessage({ type: "sandbox-log", text: args.map(a => {
          try { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); }
          catch { return String(a); }
        }).join(" ") }, "*");
      };
      console.error = (...args) => {
        parent.postMessage({ type: "sandbox-error", text: args.map(a => String(a)).join(" ") }, "*");
      };

      // Timeout protection
      const _timeout = setTimeout(() => {
        parent.postMessage({ type: "sandbox-error", text: "Execution timed out (3s limit)" }, "*");
        parent.postMessage({ type: "sandbox-done" }, "*");
      }, 3000);

      try {
        ${code}
      } catch (e) {
        parent.postMessage({ type: "sandbox-error", text: e.message || String(e) }, "*");
      }

      clearTimeout(_timeout);
      // Small delay to catch async console.logs (e.g., from setTimeout)
      setTimeout(() => parent.postMessage({ type: "sandbox-done" }, "*"), 500);
    <\/script></body></html>`;

    iframe.srcdoc = html;
  }, [code]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  // Auto-resize textarea
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Calculate line numbers
  const lineCount = code.split("\n").length;

  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#0d0d0d]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#141414] border-b border-[#1a1a1a]">
        <span className="text-[10px] text-[#888888] uppercase tracking-wider">{language}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyCode}
            className="px-2.5 py-1 text-[10px] rounded-md bg-[#1a1a1a] text-[#888888] hover:text-[#f5f5f5] hover:bg-[#333333] transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          {language === "javascript" && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-2.5 py-1 text-[10px] rounded-md bg-[#e5540a] text-white hover:bg-[#ff6b1a] transition-colors disabled:opacity-50"
            >
              {isRunning ? "Running..." : "Run"}
            </button>
          )}
        </div>
      </div>

      {/* Code editor */}
      <div className="relative flex overflow-auto max-h-[300px]">
        {/* Line numbers */}
        <div className="shrink-0 py-3 px-2 text-right select-none border-r border-[#1a1a1a] bg-[#0a0a0a]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-[11px] leading-[1.6] text-[#444444] font-mono">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editable code */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          className="flex-1 py-3 px-3 bg-transparent text-[12px] leading-[1.6] font-mono text-[#e0e0e0] resize-none outline-none min-h-[60px] whitespace-pre overflow-x-auto"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Output */}
      {output.length > 0 && (
        <div className="border-t border-[#1a1a1a] px-3 py-2 max-h-[150px] overflow-auto bg-[#0a0a0a]">
          <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Output</p>
          {output.map((line, i) => (
            <pre
              key={i}
              className={`text-[11px] leading-[1.5] font-mono whitespace-pre-wrap ${
                line.type === "error" ? "text-[#ff6b6b]" : "text-[#a0e0a0]"
              }`}
            >
              {line.text}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}
