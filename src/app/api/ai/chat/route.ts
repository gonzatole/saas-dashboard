import { streamText, convertToModelMessages } from "ai";
import { anthropic, AI_MODEL } from "@/lib/ai/client";
import { SYSTEM_PROMPT_CHAT } from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/dal";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic(AI_MODEL),
    system: SYSTEM_PROMPT_CHAT,
    messages: modelMessages,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
