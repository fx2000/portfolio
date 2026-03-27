import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "api_key_missing", message: "TTS API key not configured." },
      { status: 500 }
    );
  }

  let text: string;
  try {
    const body = await request.json();
    text = body.text?.trim();
    if (!text) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid request body." },
      { status: 400 }
    );
  }

  // Truncate to avoid large TTS bills (max ~500 chars for a chat response)
  const truncated = text.slice(0, 500);

  const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const ttsResponse = await fetch(ttsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: truncated },
      voice: {
        languageCode: "en-US",
        name: "en-US-Journey-D",  // Natural male voice
        ssmlGender: "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.05,
        pitch: 0,
      },
    }),
  });

  if (!ttsResponse.ok) {
    const errorText = await ttsResponse.text();
    console.error("Google TTS error:", ttsResponse.status, errorText);
    return NextResponse.json(
      { error: "tts_error", message: "Text-to-speech failed." },
      { status: 502 }
    );
  }

  const data = await ttsResponse.json();
  const audioContent = data.audioContent; // base64 encoded MP3

  return NextResponse.json({ audio: audioContent });
}
