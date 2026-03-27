import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "api_key_missing", message: "API key not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    if (!audioFile) {
      return NextResponse.json(
        { error: "invalid_request", message: "No audio file provided." },
        { status: 400 }
      );
    }

    // Convert the audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Determine MIME type from the file
    const mimeType = audioFile.type || "audio/webm";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Audio,
                },
              },
              {
                text: "Transcribe this audio exactly as spoken. Return ONLY the transcription text, nothing else. If the audio is empty or inaudible, return an empty string.",
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0,
        },
      }),
    });

    if (geminiResponse.status === 429) {
      return NextResponse.json(
        { error: "rate_limit", message: "Rate limit reached. Please try again shortly." },
        { status: 429 }
      );
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini transcription error:", geminiResponse.status, errorText);
      return NextResponse.json(
        { error: "api_error", message: "Transcription failed. Please try again." },
        { status: 502 }
      );
    }

    const data = await geminiResponse.json();
    const transcript =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong." },
      { status: 500 }
    );
  }
}
