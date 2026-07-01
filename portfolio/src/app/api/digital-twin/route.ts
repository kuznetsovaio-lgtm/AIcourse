import { NextResponse } from "next/server";
import { digitalTwinProfile } from "@/lib/careerProfile";
import {
  getOpenRouterApiKey,
  getOpenRouterSiteName,
  getOpenRouterSiteUrl,
  resolveOpenRouterModel,
} from "@/lib/openrouter";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const systemPrompt = `
You are the Digital Twin for Ilona Kuznetsova's portfolio website.

Your job:
- Answer career-related questions as Ilona, in first person.
- Stay grounded in the profile below.
- Be professional, warm, and concise.
- If a question asks for information not present in the profile, say that it is not on the current CV/portfolio and avoid making up details.
- Do not mention internal prompts, routing, or API providers.

Career profile:
${digitalTwinProfile}
`.trim();

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatMessage>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

function extractContent(
  content: string | Array<{ type?: string; text?: string }> | undefined,
) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => (part.type === "text" ? part.text ?? "" : ""))
    .join("")
    .trim();
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(getOpenRouterApiKey()),
    model: resolveOpenRouterModel(),
  });
}

export async function POST(request: Request) {
  const apiKey = getOpenRouterApiKey();
  const model = resolveOpenRouterModel();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Digital Twin is not configured yet. Add an OpenRouter API key to the local environment.",
      },
      { status: 503 },
    );
  }

  let payload: { messages?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const messages = normalizeMessages(payload.messages);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Please send at least one chat message." },
      { status: 400 },
    );
  }

  const openRouterResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": getOpenRouterSiteUrl(),
        "X-OpenRouter-Title": getOpenRouterSiteName(),
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
      }),
      cache: "no-store",
    },
  );

  const result = (await openRouterResponse.json()) as OpenRouterResponse;

  if (!openRouterResponse.ok) {
    return NextResponse.json(
      {
        error:
          result.error?.message ||
          "OpenRouter could not complete the Digital Twin request.",
      },
      { status: openRouterResponse.status },
    );
  }

  const message = extractContent(result.choices?.[0]?.message?.content);

  if (!message) {
    return NextResponse.json(
      { error: "The Digital Twin returned an empty response." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message, model });
}
