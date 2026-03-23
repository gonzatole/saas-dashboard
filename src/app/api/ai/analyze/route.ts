import { generateText } from "ai";
import { anthropic, AI_MODEL_FAST } from "@/lib/ai/client";
import {
  SYSTEM_PROMPT_ANALYZE,
  buildIncidentAnalysisPrompt,
  buildInspectionAnalysisPrompt,
} from "@/lib/ai/prompts";
import { requireAuth } from "@/lib/dal";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { type, data } = body as {
    type: "incident" | "inspection";
    data: Record<string, unknown>;
  };

  let prompt = "";
  if (type === "incident") {
    prompt = buildIncidentAnalysisPrompt(data as Parameters<typeof buildIncidentAnalysisPrompt>[0]);
  } else if (type === "inspection") {
    prompt = buildInspectionAnalysisPrompt(data as Parameters<typeof buildInspectionAnalysisPrompt>[0]);
  } else {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const { text } = await generateText({
    model: anthropic(AI_MODEL_FAST),
    system: SYSTEM_PROMPT_ANALYZE,
    prompt,
    maxOutputTokens: 1024,
  });

  return Response.json({ analysis: text });
}
