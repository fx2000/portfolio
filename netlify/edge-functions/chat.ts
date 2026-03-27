import type { Context } from "https://edge.netlify.com";

// NOTE: This prompt MUST be kept in sync with src/data/chatContext.ts
// The edge function cannot import from src/ since it runs in Deno.
import { CHAT_SYSTEM_PROMPT } from "../../src/data/chatContext.ts";

/** Maps chat messages to the Gemini API content format. */
function buildGeminiContents(
  messages: Array<{ role: string; content: string }>
) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export default async function handler(request: Request, _context: Context) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return Response.json(
      { error: "method_not_allowed", message: "Only POST is accepted." },
      { status: 405 }
    );
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return Response.json(
      { error: "api_key_missing", message: "API key not configured." },
      { status: 500 }
    );
  }

  let messages: Array<{ role: string; content: string }>;
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return Response.json(
      { error: "invalid_request", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
      contents: buildGeminiContents(messages),
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    }),
  });

  if (geminiResponse.status === 429) {
    return Response.json(
      {
        error: "rate_limit",
        message:
          "I'm at capacity right now — the free tier limit has been reached. Please try again in a few minutes, or come back tomorrow!",
      },
      { status: 429 }
    );
  }

  if (!geminiResponse.ok) {
    console.error("Gemini API error:", geminiResponse.status);
    return Response.json(
      { error: "api_error", message: "Something went wrong. Please try again shortly." },
      { status: 502 }
    );
  }

  const data = await geminiResponse.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I couldn't generate a response. Please try again.";

  return Response.json({ reply });
}
