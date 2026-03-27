"use client";

/**
 * SVG architecture diagram showing the AI pipeline of the portfolio site.
 * Used in the portfolio project details and available via chatbot command.
 */
export default function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto py-4">
      <svg
        viewBox="0 0 900 520"
        className="w-full max-w-[900px] mx-auto"
        style={{ minWidth: 600 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AI Portfolio Architecture Diagram"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 7" refX="9" refY="3.5"
            markerWidth="8" markerHeight="6" orient="auto-start-auto">
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#e5540a" />
          </marker>
          <marker id="arrow-gray" viewBox="0 0 10 7" refX="9" refY="3.5"
            markerWidth="8" markerHeight="6" orient="auto-start-auto">
            <path d="M 0 0 L 10 3.5 L 0 7 z" fill="#555" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="900" height="520" rx="16" fill="#0a0a0a" />

        {/* Title */}
        <text x="450" y="36" textAnchor="middle" fill="#f5f5f5" fontSize="16" fontWeight="700" fontFamily="monospace">
          AI Portfolio — Architecture
        </text>

        {/* ── Browser Layer ── */}
        <rect x="30" y="60" width="840" height="140" rx="12" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="50" y="82" fill="#555" fontSize="11" fontFamily="monospace">BROWSER</text>

        {/* Chat Widget */}
        <rect x="60" y="96" width="160" height="80" rx="8" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="140" y="128" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">Chat Widget</text>
        <text x="140" y="146" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Text + Voice Input</text>
        <text x="140" y="160" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Command Parser</text>

        {/* Effects Engine */}
        <rect x="260" y="96" width="160" height="80" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="340" y="128" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">Effects Engine</text>
        <text x="340" y="146" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">GSAP Animations</text>
        <text x="340" y="160" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Canvas Overlays</text>

        {/* Code Sandbox */}
        <rect x="460" y="96" width="160" height="80" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="540" y="128" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">Code Sandbox</text>
        <text x="540" y="146" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Live JS Editor</text>
        <text x="540" y="160" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Sandboxed iframe</text>

        {/* Web Speech API */}
        <rect x="660" y="96" width="180" height="80" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="750" y="128" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">Web Speech API</text>
        <text x="750" y="146" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Speech-to-Text (STT)</text>
        <text x="750" y="160" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Browser Native</text>

        {/* Arrow: Chat → Effects */}
        <line x1="220" y1="136" x2="258" y2="136" stroke="#e5540a" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Arrow: Chat → Code Sandbox */}
        <line x1="220" y1="146" x2="230" y2="146" stroke="#555" strokeWidth="1" />
        <line x1="230" y1="146" x2="230" y2="170" stroke="#555" strokeWidth="1" />
        <line x1="230" y1="170" x2="450" y2="170" stroke="#555" strokeWidth="1" />
        <line x1="450" y1="170" x2="450" y2="146" stroke="#555" strokeWidth="1" />
        <line x1="450" y1="146" x2="458" y2="146" stroke="#555" strokeWidth="1" markerEnd="url(#arrow-gray)" />

        {/* Arrow: Speech → Chat */}
        <line x1="660" y1="136" x2="222" y2="136" stroke="#555" strokeWidth="1" strokeDasharray="4 2" />

        {/* ── Server Layer ── */}
        <rect x="30" y="230" width="840" height="120" rx="12" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="50" y="252" fill="#555" fontSize="11" fontFamily="monospace">NEXT.JS API ROUTES (Netlify)</text>

        {/* /api/chat */}
        <rect x="100" y="266" width="180" height="60" rx="8" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="190" y="292" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">/api/chat</text>
        <text x="190" y="308" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">System Prompt + Context</text>

        {/* /api/tts */}
        <rect x="360" y="266" width="180" height="60" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="450" y="292" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">/api/tts</text>
        <text x="450" y="308" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Text → Audio</text>

        {/* /api/transcribe */}
        <rect x="620" y="266" width="180" height="60" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="710" y="292" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">/api/transcribe</text>
        <text x="710" y="308" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Audio → Text (fallback)</text>

        {/* Arrows: Browser → Server */}
        <line x1="140" y1="176" x2="140" y2="220" stroke="#e5540a" strokeWidth="1.5" />
        <line x1="140" y1="220" x2="190" y2="220" stroke="#e5540a" strokeWidth="1.5" />
        <line x1="190" y1="220" x2="190" y2="264" stroke="#e5540a" strokeWidth="1.5" markerEnd="url(#arrow)" />

        <line x1="160" y1="176" x2="160" y2="210" stroke="#555" strokeWidth="1" />
        <line x1="160" y1="210" x2="450" y2="210" stroke="#555" strokeWidth="1" />
        <line x1="450" y1="210" x2="450" y2="264" stroke="#555" strokeWidth="1" markerEnd="url(#arrow-gray)" />

        {/* ── External APIs ── */}
        <rect x="30" y="390" width="840" height="110" rx="12" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="50" y="412" fill="#555" fontSize="11" fontFamily="monospace">EXTERNAL APIs</text>

        {/* Gemini */}
        <rect x="80" y="426" width="200" height="56" rx="8" fill="#1a1206" stroke="#e5540a" strokeWidth="1.5" />
        <text x="180" y="452" textAnchor="middle" fill="#e5540a" fontSize="13" fontWeight="700" fontFamily="monospace">Gemini 2.5 Flash</text>
        <text x="180" y="468" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Chat + Transcription + Commands</text>

        {/* Google Cloud TTS */}
        <rect x="350" y="426" width="200" height="56" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="450" y="452" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">Google Cloud TTS</text>
        <text x="450" y="468" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">Neural Voice (Journey-D)</text>

        {/* js-dos CDN */}
        <rect x="620" y="426" width="200" height="56" rx="8" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="720" y="452" textAnchor="middle" fill="#f5f5f5" fontSize="12" fontWeight="600" fontFamily="monospace">js-dos CDN</text>
        <text x="720" y="468" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace">DOOM Shareware (WASM)</text>

        {/* Arrows: Server → External */}
        <line x1="190" y1="326" x2="190" y2="370" stroke="#e5540a" strokeWidth="1.5" />
        <line x1="190" y1="370" x2="180" y2="370" stroke="#e5540a" strokeWidth="1.5" />
        <line x1="180" y1="370" x2="180" y2="424" stroke="#e5540a" strokeWidth="1.5" markerEnd="url(#arrow)" />

        <line x1="450" y1="326" x2="450" y2="424" stroke="#555" strokeWidth="1" markerEnd="url(#arrow-gray)" />

        {/* Arrow: Browser direct → js-dos */}
        <line x1="540" y1="176" x2="540" y2="190" stroke="#555" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="540" y1="190" x2="860" y2="190" stroke="#555" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="860" y1="190" x2="860" y2="454" stroke="#555" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="860" y1="454" x2="822" y2="454" stroke="#555" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrow-gray)" />
      </svg>
    </div>
  );
}
