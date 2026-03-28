"use client";

/**
 * SVG architecture diagram showing the AI pipeline of the portfolio site.
 * Wide horizontal layout: Browser → Server → External APIs stacked vertically
 * with components spread horizontally within each layer.
 */
export default function ArchitectureDiagram() {
  return (
    <div className="w-full py-4">
      <svg
        viewBox="0 0 940 580"
        className="w-full mx-auto"
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
        <rect width="940" height="580" rx="12" fill="#0a0a0a" />

        {/* Title */}
        <text x="470" y="28" textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700" fontFamily="monospace">
          AI Portfolio — Architecture
        </text>

        {/* ── BROWSER LAYER ── */}
        <rect x="16" y="42" width="908" height="120" rx="10" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="30" y="58" fill="#555" fontSize="9" fontFamily="monospace">BROWSER</text>

        {/* Browser components — 7 boxes in a row */}
        <rect x="28" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="84" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Chat Widget</text>
        <text x="84" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Voice + Commands</text>

        <rect x="152" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="208" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Effects Engine</text>
        <text x="208" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">GSAP + Canvas</text>

        <rect x="276" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="332" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Code Sandbox</text>
        <text x="332" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Live JS + iframe</text>

        <rect x="400" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="456" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Fluid Cursor</text>
        <text x="456" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">WebGL</text>

        <rect x="524" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="580" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Web Speech API</text>
        <text x="580" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">STT</text>

        <rect x="648" y="68" width="112" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="704" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">DOOM Overlay</text>
        <text x="704" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">js-dos WASM</text>

        <rect x="772" y="68" width="140" height="44" rx="6" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="842" y="86" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Whiteboard</text>
        <text x="842" y="98" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Shapes + Live Cursors</text>

        {/* Arrow: Chat → Effects */}
        <line x1="140" y1="90" x2="150" y2="90" stroke="#e5540a" strokeWidth="1" markerEnd="url(#arrow)" />

        {/* ── SERVER LAYER ── */}
        <rect x="16" y="222" width="908" height="90" rx="10" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="30" y="238" fill="#555" fontSize="9" fontFamily="monospace">NEXT.JS API ROUTES (Netlify)</text>

        <rect x="120" y="250" width="180" height="44" rx="6" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="210" y="268" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">/api/chat</text>
        <text x="210" y="280" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">System Prompt + Context</text>

        <rect x="380" y="250" width="180" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="470" y="268" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">/api/tts</text>
        <text x="470" y="280" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Text → Audio</text>

        <rect x="640" y="250" width="180" height="44" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="730" y="268" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">/api/transcribe</text>
        <text x="730" y="280" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Audio → Text (fallback)</text>

        {/* Arrow: Chat Widget → /api/chat */}
        <polyline
          points="84,112 84,185 110,185 110,272 118,272"
          fill="none" stroke="#e5540a" strokeWidth="1.5" markerEnd="url(#arrow)"
        />

        {/* Arrow: Chat Widget → /api/tts */}
        <polyline
          points="60,112 60,195 370,195 370,272 378,272"
          fill="none" stroke="#555" strokeWidth="1" markerEnd="url(#arrow-gray)"
        />

        {/* ── EXTERNAL APIS LAYER ── */}
        <rect x="16" y="372" width="908" height="90" rx="10" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="30" y="388" fill="#555" fontSize="9" fontFamily="monospace">EXTERNAL APIs</text>

        <rect x="60" y="396" width="180" height="48" rx="6" fill="#1a1206" stroke="#e5540a" strokeWidth="1.5" />
        <text x="150" y="416" textAnchor="middle" fill="#e5540a" fontSize="10" fontWeight="700" fontFamily="monospace">Gemini 2.5 Flash</text>
        <text x="150" y="430" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Chat + Commands</text>

        <rect x="300" y="396" width="180" height="48" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="390" y="416" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">Google Cloud TTS</text>
        <text x="390" y="430" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Neural Voice (Journey-D)</text>

        <rect x="540" y="396" width="180" height="48" rx="6" fill="#141414" stroke="#333" strokeWidth="1" />
        <text x="630" y="416" textAnchor="middle" fill="#f5f5f5" fontSize="9" fontWeight="600" fontFamily="monospace">js-dos CDN</text>
        <text x="630" y="430" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">DOOM Shareware (WASM)</text>

        <rect x="760" y="396" width="150" height="48" rx="6" fill="#141414" stroke="#e5540a" strokeWidth="1.5" />
        <text x="835" y="416" textAnchor="middle" fill="#e5540a" fontSize="9" fontWeight="700" fontFamily="monospace">Supabase</text>
        <text x="835" y="430" textAnchor="middle" fill="#888" fontSize="7" fontFamily="monospace">Presence + Broadcast</text>

        {/* Arrow: /api/chat → Gemini */}
        <polyline
          points="210,294 210,345 150,345 150,394"
          fill="none" stroke="#e5540a" strokeWidth="1.5" markerEnd="url(#arrow)"
        />

        {/* Arrow: /api/tts → Google Cloud TTS */}
        <polyline
          points="470,294 470,355 390,355 390,394"
          fill="none" stroke="#555" strokeWidth="1" markerEnd="url(#arrow-gray)"
        />

        {/* Arrow: DOOM Overlay → js-dos CDN (exits bottom of box, routes right side) */}
        <polyline
          points="750,112 750,175 895,175 895,420 720,420"
          fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrow-gray)"
        />

        {/* Arrow: Whiteboard → Supabase (exits bottom of box, routes far right) */}
        <polyline
          points="900,112 900,155 925,155 925,420 912,420"
          fill="none" stroke="#e5540a" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrow)"
        />

        {/* WebSocket label */}
        <rect x="900" y="270" width="54" height="14" rx="3" fill="#0a0a0a" />
        <text x="927" y="280" textAnchor="middle" fill="#e5540a" fontSize="7" fontFamily="monospace">WebSocket</text>

        {/* ── LEGEND ── */}
        <line x1="30" y1="500" x2="55" y2="500" stroke="#e5540a" strokeWidth="1.5" />
        <text x="62" y="504" fill="#888" fontSize="8" fontFamily="monospace">Primary flow</text>

        <line x1="30" y1="518" x2="55" y2="518" stroke="#555" strokeWidth="1" />
        <text x="62" y="522" fill="#888" fontSize="8" fontFamily="monospace">Secondary flow</text>

        <line x1="30" y1="536" x2="55" y2="536" stroke="#555" strokeWidth="1" strokeDasharray="3 2" />
        <text x="62" y="540" fill="#888" fontSize="8" fontFamily="monospace">Direct connection (browser → external)</text>

        <line x1="400" y1="500" x2="425" y2="500" stroke="#e5540a" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="432" y="504" fill="#888" fontSize="8" fontFamily="monospace">Real-time (WebSocket)</text>
      </svg>
    </div>
  );
}
